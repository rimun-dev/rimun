import { Form, Formik } from "formik";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { CommitteesRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface AddTopicToCommitteeModalFormProps extends ModalProps {
  committee: CommitteesRouterOutputs["getCommittee"];
  onCreated: (t: CommitteesRouterOutputs["createCommitteeTopic"]) => void;
}

export default function AddTopicToCommitteeModalForm(
  props: AddTopicToCommitteeModalFormProps
) {
  const dispatch = useStateDispatch();

  const mutation = trpc.committees.createCommitteeTopic.useMutation({
    onSuccess: (data) => {
      props.onCreated(data);
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Topic was created successfully.",
        })
      );
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-sm bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Create Topic
      </ModalHeader>

      <p className="px-4 text-sm">Upload a new topic for this committee.</p>

      <Formik
        onSubmit={(v) =>
          mutation.mutate({ ...v, committee_id: props.committee.id })
        }
        initialValues={{ name: "" }}
        validationSchema={Yup.object({
          name: Yup.string().required("Please insert a title."),
        })}
      >
        <Form className="p-4">
          <Label htmlFor="name" className="w-full bloc mt-4">
            Topic Name
            <TextInputField name="name" placeholder="Insert topic title" />
          </Label>

          <ModalFooter
            isLoading={mutation.isLoading}
            {...props}
            actionTitle="Add Topic"
          />
        </Form>
      </Formik>
    </Modal>
  );
}
