import { Form, Formik } from "formik";
import DateInputField from "src/components/fields/base/DateInputField";
import DocumentField from "src/components/fields/base/DocumentField";
import ImagePreviewField from "src/components/fields/base/ImagePreviewField";
import SelectField from "src/components/fields/base/SelectField";
import TextAreaField from "src/components/fields/base/TextAreaField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { TimelineRouterInputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface CreateTimelineEventModalFormProps extends ModalProps {}

export default function CreateTimelineEventModalForm(
  props: CreateTimelineEventModalFormProps
) {
  const dispatch = useStateDispatch();
  const trpcCtx = trpc.useContext();

  const mutation = trpc.timeline.createEvent.useMutation({
    onSuccess: () => {
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Timeline event was successfully created",
        })
      );
      trpcCtx.timeline.getEvents.invalidate();
    },
  });

  return (
    <Modal
      {...props}
      className="w-1/2 h-screen top-0 overflow-y-auto bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Create Timeline Event
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(v) => mutation.mutate(v)}
        initialValues={
          {
            name: "",
            date: new Date(),
            description: "",
            type: "EDITION",
            document: "",
            picture: "",
          } as TimelineRouterInputs["createEvent"]
        }
        validationSchema={Yup.object({
          name: Yup.string().required(),
          date: Yup.date().required(),
          description: Yup.string(),
          type: Yup.string().oneOf(["EDITION", "OTHER"]).required(),
          document: Yup.string(),
          picture: Yup.string(),
        })}
      >
        <Form className="p-4">
          <Label htmlFor="type" className="w-full">
            Category
            <SelectField
              name="type"
              className="w-full"
              options={[
                { name: "RIMUN Edition", value: "EDITION" },
                { name: "Other Event", value: "OTHER" },
              ]}
            />
          </Label>

          <Label htmlFor="name" className="w-full block mt-4">
            Name
            <TextInputField
              name="name"
              placeholder="e.g. First World Photo Exhibition"
            />
          </Label>

          <Label htmlFor="date" className="w-full md:mr-1">
            Date of event
            <DateInputField name="date" className="w-full" required />
          </Label>

          <Label htmlFor="description" className="w-full block mt-4">
            Description
            <TextAreaField
              name="description"
              placeholder="Write the description here..."
            />
          </Label>

          <Label htmlFor="document" className="mt-4">
            Document (optional)
            <DocumentField name="document" />
          </Label>

          <Label htmlFor="picture" className="mt-4">
            Picture (optional)
            <ImagePreviewField name="picture" />
          </Label>

          <ModalFooter
            actionTitle="Create Event"
            setIsVisible={props.setIsVisible}
            isLoading={mutation.isLoading}
          />
        </Form>
      </Formik>
    </Modal>
  );
}
