import { Form, Formik } from "formik";
import SelectCommitteeField from "src/components/fields/base/SelectCommitteeField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { DelegationsRouterOutputs, trpc } from "src/trpc";
import { renderDelegationName } from "src/utils/strings";
import * as Yup from "yup";

interface AssignCommitteeToDelegationModalFormProps extends ModalProps {
  delegationData: DelegationsRouterOutputs["getDelegation"];
  onAssigned: () => void;
}

export default function AssignCommitteeToDelegationModalForm(
  props: AssignCommitteeToDelegationModalFormProps
) {
  const dispatch = useStateDispatch();

  const mutation = trpc.delegations.assignCommittee.useMutation({
    onSuccess: () => {
      props.onAssigned();
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Committee was assigned to the delegation successfully.",
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
        Assign Delegation to Committee
      </ModalHeader>

      <p className="px-4 text-sm">
        The delegation <b>{renderDelegationName(props.delegationData)}</b> will
        be assigned to the committee.
      </p>

      <Formik
        onSubmit={(v) =>
          mutation.mutate({ ...v, delegation_id: props.delegationData.id })
        }
        initialValues={{ committee_id: -1 }}
        validationSchema={Yup.object({
          committee_id: Yup.number()
            .min(0, "Please select a committee.")
            .required("Please select a committee."),
        })}
      >
        <Form className="p-4">
          <Label htmlFor="committee_id" className="w-full bloc mt-4">
            Select the Committee
            <SelectCommitteeField name="committee_id" />
          </Label>

          <ModalFooter
            isLoading={mutation.isLoading}
            {...props}
            actionTitle="Assign Committee"
          />
        </Form>
      </Formik>
    </Modal>
  );
}
