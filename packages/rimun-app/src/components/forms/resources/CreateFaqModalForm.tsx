import { Form, Formik } from "formik";
import CancelButton from "src/components/fields/base/CancelButton";
import SelectField from "src/components/fields/base/SelectField";
import SubmitButton from "src/components/fields/base/SubmitButton";
import TextAreaField from "src/components/fields/base/TextAreaField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { ResourcesRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface CreateFaqModalFormProps extends ModalProps {
  categories: ResourcesRouterOutputs["getFaqs"];
  onFaqCreated: () => void;
}

export default function CreateFaqModalForm(props: CreateFaqModalFormProps) {
  const mutation = trpc.resources.createFaq.useMutation({
    onSuccess: () => {
      props.onFaqCreated();
      props.setIsVisible(false);
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Create New F.A.Q.
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(v) => mutation.mutate(v)}
        initialValues={{ question: "", answer: "", category_id: 0 }}
        validationSchema={Yup.object({
          question: Yup.string().required("Please insert a question/title."),
          answer: Yup.string().required("Please insert an answer."),
          category_id: Yup.number()
            .oneOf(
              props.categories.map((c) => c.id),
              "Please selet a valid category."
            )
            .required("Please selet a category."),
        })}
      >
        {() => (
          <Form className="p-4">
            <Label htmlFor="category_id" className="w-full">
              Category
              <SelectField
                name="category_id"
                options={props.categories.map((c) => ({
                  name: c.name,
                  value: c.id,
                }))}
              />
            </Label>

            <Label htmlFor="question" className="w-full block mt-4">
              Question/Title
              <TextInputField
                name="question"
                placeholder="e.g. When will reports be published?"
              />
            </Label>

            <Label htmlFor="answer" className="w-full block mt-4">
              Answer
              <TextAreaField
                name="answer"
                placeholder="Write your explanation here..."
                className="w-full h-24"
              />
            </Label>

            <div className="flex mt-6 justify-between">
              <CancelButton
                onClick={() => props.setIsVisible(false)}
                className="flex justify-center items-center flex-1 mr-2"
              >
                Cancel
              </CancelButton>

              <SubmitButton
                isLoading={mutation.isLoading}
                className="ml-2 flex-1"
              >
                Create F.A.Q.
              </SubmitButton>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
