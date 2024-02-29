import { Form, Formik } from "formik";
import DateInputField from "src/components/fields/base/DateInputField";
import MardownEditorField from "src/components/fields/base/MardownEditorField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { RouterInputs, RouterOutputs } from "src/trpc";
import * as Yup from "yup";

interface UpdateSessionModalFormProps extends ModalProps {
  sessionData: RouterOutputs["sessions"]["getAllSessions"][0];
}

export default function UpdateSessionModalForm(
  props: UpdateSessionModalFormProps
) {
  return (
    <Modal
      {...props}
      className="w-screen h-screen bg-white left-0 top-0 overflow-y-auto"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Update Sessions Information
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={() => {}}
        initialValues={
          {
            id: props.sessionData.id,
            title: props.sessionData.title,
            subtitle: props.sessionData.subtitle,
            description: props.sessionData.description,
            edition_display: props.sessionData.edition_display,
            date_start: props.sessionData.date_start,
            date_end: props.sessionData.date_end,
            is_active: props.sessionData.is_active,
            picture: undefined,
          } as RouterInputs["sessions"]["updateSession"] // TODO: change to satisfies
        }
        validationSchema={Yup.object({
          name: Yup.string().required(
            "Please choose a name for this category."
          ),
        })}
      >
        <Form className="px-4">
          <Label htmlFor="title" className="w-full block mt-4">
            Title
            <TextInputField name="title" placeholder="Session's title" />
          </Label>

          <Label htmlFor="subtitle" className="w-full block mt-4">
            Subtitle
            <TextInputField name="subtitle" placeholder="Session's subtitle" />
          </Label>

          <div className="md:flex justify-between items-center gap-4 mt-4">
            <Label htmlFor="date_start" className="w-full block ">
              Start Date
              <DateInputField name="date_start" />
            </Label>

            <Label htmlFor="date_end" className="w-full block ">
              End Date
              <DateInputField name="date_end" />
            </Label>
          </div>

          <Label
            htmlFor="description"
            className="w-full block mt-4 font-normal"
          >
            <b>Description</b>
            <MardownEditorField
              name="description"
              placeholder="Write the description here..."
            />
          </Label>
        </Form>
      </Formik>
    </Modal>
  );
}
