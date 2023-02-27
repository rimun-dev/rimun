import { Form, Formik } from "formik";
import SubmitButton from "src/components/buttons/SubmitButton";
import MardownEditorField from "src/components/fields/base/MardownEditorField";
import SelectField from "src/components/fields/base/SelectField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import {
  extractTargetAudienceFromPost,
  TARGET_AUDIENCES,
} from "src/components/forms/news/utils";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { NewsRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface UpdateBlogPostModalFormProps extends ModalProps {
  blogPost: NewsRouterOutputs["getPosts"][0];
}

export default function UpdateBlogPostModalForm(
  props: UpdateBlogPostModalFormProps
) {
  const trpcCtx = trpc.useContext();

  const mutation = trpc.news.updatePost.useMutation({
    onSuccess: () => {
      trpcCtx.news.getPosts.invalidate();
      props.setIsVisible(false);
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-4xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Update Blog Post
      </ModalHeader>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={({ target, ...values }) => {
          mutation.mutate({
            post_id: props.blogPost.id,
            is_for_persons: target === "ALL" || target === "PERSON",
            is_for_schools: target === "ALL" || target === "SCHOOL",
            ...values,
          });
        }}
        initialValues={{
          title: props.blogPost.title,
          body: props.blogPost.body,
          target: extractTargetAudienceFromPost(props.blogPost),
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Please insert a title."),
          body: Yup.string().required("Please insert a body."),
          target: Yup.mixed()
            .oneOf([...TARGET_AUDIENCES], "Please select a target audience.")
            .required("Please select a target audience."),
        })}
      >
        {() => (
          <Form className="px-4 pb-4" data-color-mode="light">
            <Label htmlFor="title">
              Title
              <TextInputField
                name="title"
                placeholder="Title"
                className="w-full"
                required
              />
            </Label>

            <Label htmlFor="target">
              <div className="mt-4">Target audience</div>
              <SelectField
                name="target"
                options={[
                  { name: "All", value: "ALL" },
                  { name: "Schools", value: "SCHOOL" },
                  { name: "Students", value: "PERSON" },
                ]}
              />
            </Label>

            <div className="h-4" />

            <MardownEditorField name="body" />

            {/* <MDEditor
              value={values.body}
              height={350}
              onChange={(v) => setFieldValue("body", v)}
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
            /> */}

            <div className="py-4 text-xs">
              Need some help understanding the MarkDown editor? Visit the{" "}
              <a
                href="https://www.markdownguide.org/basic-syntax/"
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Documentation
              </a>
            </div>

            <SubmitButton
              isLoading={mutation.isLoading}
              className="float-right my-4"
            >
              Update Post
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
