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
import { TimelineRouterInputs, TimelineRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface EditTimelineEventModalFormProps extends ModalProps {
  eventData: TimelineRouterOutputs["getEvents"][0];
}

export default function EditTimelineEventModalForm(
  props: EditTimelineEventModalFormProps
) {
  const dispatch = useStateDispatch();
  const trpcCtx = trpc.useContext();

  const mutation = trpc.timeline.updateEvent.useMutation({
    onSuccess: () => {
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Timeline event was successfully updated",
        })
      );
      trpcCtx.timeline.getEvents.invalidate();
    },
  });

  return (
    <Modal
      {...props}
      className="max-w-screen-md h-screen top-0 overflow-y-auto bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Update Timeline Event
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={({ picture, document, ...v }) => {
          let data: TimelineRouterInputs["updateEvent"] = { ...v };
          if (picture !== "") data.picture = picture;
          if (document !== "") data.document = document;
          mutation.mutate(data);
        }}
        initialValues={
          {
            id: props.eventData.id,
            name: props.eventData.name,
            date: props.eventData.date,
            description: props.eventData.description ?? "",
            type: props.eventData.type,
            document: "",
            picture: "",
          } as TimelineRouterInputs["updateEvent"]
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
            actionTitle="Update Event"
            setIsVisible={props.setIsVisible}
            isLoading={mutation.isLoading}
          />
        </Form>
      </Formik>
    </Modal>
  );
}
