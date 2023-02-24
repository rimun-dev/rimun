import { Form, Formik } from "formik";
import CancelButton from "src/components/fields/base/CancelButton";
import SubmitButton from "src/components/fields/base/SubmitButton";
import TextAreaField from "src/components/fields/base/TextAreaField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { ResourcesRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface UpdateFaqModalFormProps extends ModalProps {
  faq: ResourcesRouterOutputs["getFaqs"][0]["faqs"][0];
  onFaqUpdated: () => void;
}

export default function UpdateFaqModalForm(props: UpdateFaqModalFormProps) {
  const mutation = trpc.resources.updateFaq.useMutation({
    onSuccess: () => {
      props.onFaqUpdated();
      props.setIsVisible(false);
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Update F.A.Q.
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(v) => mutation.mutate({ ...v, faq_id: props.faq.id })}
        initialValues={{
          question: props.faq.question,
          answer: props.faq.answer,
        }}
        validationSchema={Yup.object({
          question: Yup.string().required("Please insert a question/title."),
          answer: Yup.string().required("Please insert an answer."),
        })}
      >
        {() => (
          <Form className="p-4">
            <Label htmlFor="question" className="w-full">
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
                Update F.A.Q.
              </SubmitButton>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
