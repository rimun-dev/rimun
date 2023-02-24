import { Form, Formik } from "formik";
import CheckBoxField from "src/components/fields/base/CheckBoxField";
import SearchPersonField from "src/components/fields/base/SearchPersonField";
import SelectCommitteeField from "src/components/fields/base/SelectCommitteeField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import Spinner from "src/components/status/Spinner";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import {
  CommitteesRouterOutputs,
  DelegationsRouterOutputs,
  SearchRouterInputs,
  trpc,
} from "src/trpc";
import { useDelegationName } from "src/utils/strings";
import useRolesInformation from "src/utils/useRolesInformation";
import * as Yup from "yup";

interface AssignDelegateToDelegationModalFormProps extends ModalProps {
  delegation: DelegationsRouterOutputs["getDelegation"];
  committee?:
    | CommitteesRouterOutputs["getCommittee"]
    | DelegationsRouterOutputs["getDelegation"]["delegation_committee_assignments"][0]["committee"];
  onAssigned: () => void;
  filters?: SearchRouterInputs["searchPersons"]["filters"];
}

export default function AssignDelegateToDelegationModalForm(
  props: AssignDelegateToDelegationModalFormProps
) {
  const dispatch = useStateDispatch();
  const rolesInfo = useRolesInformation();

  const mutation = trpc.delegations.addDelegate.useMutation({
    onSuccess: () => {
      props.onAssigned();
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Delegate was assigned to the delegation successfully.",
        })
      );
    },
  });

  const delegationNameInfo = useDelegationName(props.delegation);

  if (delegationNameInfo.isLoading) return null;

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-sm bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Assign Delegate to Delegation
      </ModalHeader>

      <p className="px-4 text-sm">
        This delegate will be assigned to the delegation:{" "}
        <b>{delegationNameInfo.name}</b>
      </p>

      {rolesInfo.isLoading ? (
        <Spinner />
      ) : (
        <Formik
          onSubmit={(v) =>
            mutation.mutate({ ...v, delegation_id: props.delegation.id })
          }
          initialValues={{
            person_id: -1,
            committee_id: props.committee?.id ?? -1,
            is_ambassador: false,
          }}
          validationSchema={Yup.object({
            person_id: Yup.number()
              .min(0, "Please select a delegate.")
              .required("Please select a delegate."),
            committee_id: Yup.number()
              .min(0, "Please select a committee.")
              .required("Please select a committee."),
            is_ambassador: Yup.boolean(),
          })}
        >
          <Form className="p-4">
            <Label htmlFor="person_id" className="w-full bloc mt-4">
              Select the delegate
              <SearchPersonField
                name="person_id"
                filters={{
                  ...props.filters,
                  status_application: "ACCEPTED",
                  confirmed_group_id: rolesInfo.getGroupIdByName("delegate"),
                }}
              />
            </Label>

            {!props.committee && (
              <Label htmlFor="committee_id" className="w-full bloc mt-4">
                Select the Committee
                <SelectCommitteeField name="committee_id" />
              </Label>
            )}

            <Label htmlFor="name">
              <div className="flex flex-row items-center gap-4  mt-4">
                <p>
                  Do you want for this delegate to be the delegation's
                  ambassador?
                </p>
                <CheckBoxField name="is_ambassador" />
                (check=yes)
              </div>
            </Label>

            <ModalFooter
              isLoading={mutation.isLoading}
              {...props}
              actionTitle="Assign Delegate"
            />
          </Form>
        </Formik>
      )}
    </Modal>
  );
}
