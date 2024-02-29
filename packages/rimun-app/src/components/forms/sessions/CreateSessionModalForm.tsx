import { Form, Formik } from "formik";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { RouterInputs } from "src/trpc";
import * as Yup from "yup";

interface CreateSessionModalFormProps extends ModalProps {
  nextEdition: number;
}

export default function CreateSessionModalForm(
  props: CreateSessionModalFormProps
) {
  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Create New RIMUN Session
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={() => {}}
        initialValues={
          {
            title: "",
            description: "",
            edition_display: props.nextEdition,
            date_start: new Date(),
            date_end: new Date(),
            is_active: false,
            secretary_general_id: -1,
          } satisfies RouterInputs["sessions"]["createSession"]
        }
        validationSchema={Yup.object({
          name: Yup.string().required(
            "Please choose a name for this category."
          ),
        })}
      >
        <Form>
          <Label htmlFor="title" className="w-full block mt-4">
            Title
            <TextInputField name="title" placeholder="Session's title" />
          </Label>
        </Form>
      </Formik>
    </Modal>
  );
}
