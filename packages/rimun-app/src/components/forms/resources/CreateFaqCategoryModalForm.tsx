import { Form, Formik } from "formik";
import SubmitButton from "src/components/buttons/SubmitButton";
import CancelButton from "src/components/fields/base/CancelButton";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { trpc } from "src/trpc";
import * as Yup from "yup";

interface CreateFaqCategoryModalFormProps extends ModalProps {
  onFaqCategoryCreated: () => void;
}

export default function CreateFaqCategoryModalForm(
  props: CreateFaqCategoryModalFormProps
) {
  const mutation = trpc.resources.createFaqCategory.useMutation({
    onSuccess: () => {
      props.onFaqCategoryCreated();
      props.setIsVisible(false);
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Create New Category
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(v) => mutation.mutate(v)}
        initialValues={{ name: "" }}
        validationSchema={Yup.object({
          name: Yup.string().required(
            "Please choose a name for this category."
          ),
        })}
      >
        {() => (
          <Form className="p-4">
            <Label htmlFor="name" className="w-full block mt-4">
              Name
              <TextInputField
                name="name"
                placeholder="e.g. General Questions"
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
                Create Category
              </SubmitButton>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
