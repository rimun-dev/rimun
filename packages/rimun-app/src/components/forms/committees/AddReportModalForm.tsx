import { Form, Formik } from "formik";
import DocumentField from "src/components/fields/base/DocumentField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { CommitteesRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface AddReportModalFormProps extends ModalProps {
  committee: CommitteesRouterOutputs["getCommittee"];
  onUpdated: (r: CommitteesRouterOutputs["updateCommitteeReport"]) => void;
}

export default function AddReportModalForm(props: AddReportModalFormProps) {
  const dispatch = useStateDispatch();

  const mutation = trpc.committees.updateCommitteeReport.useMutation({
    onSuccess: (data) => {
      props.onUpdated(data);
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Report was udpated successfully.",
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
        Update Report
      </ModalHeader>

      <p className="px-4 text-sm">Upload a new report for this committee.</p>

      <Formik
        onSubmit={(v) =>
          mutation.mutate({ ...v, committee_id: props.committee.id })
        }
        initialValues={{ document: "", name: "" }}
        validationSchema={Yup.object({
          name: Yup.string().required("Please insert a title."),
          document: Yup.string().required(
            "Please upload a file for the report."
          ),
        })}
      >
        <Form className="p-4">
          <Label htmlFor="name" className="w-full bloc mt-4">
            Report Title
            <TextInputField name="name" placeholder="Committee Report" />
          </Label>

          <Label htmlFor="document" className="w-full bloc mt-4">
            Select the document
            <DocumentField name="document" />
          </Label>

          <ModalFooter
            isLoading={mutation.isLoading}
            {...props}
            actionTitle="Update Report"
          />
        </Form>
      </Formik>
    </Modal>
  );
}
