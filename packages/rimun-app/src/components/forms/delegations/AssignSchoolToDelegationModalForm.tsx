import { Form, Formik } from "formik";
import SearchSchoolField from "src/components/fields/base/SearchSchoolField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import Spinner from "src/components/status/Spinner";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { DelegationsRouterOutputs, trpc } from "src/trpc";
import { useDelegationName } from "src/utils/strings";
import useRolesInformation from "src/utils/useRolesInformation";
import * as Yup from "yup";

interface AssignSchoolToDelegationModalFormProps extends ModalProps {
  delegationData: DelegationsRouterOutputs["getDelegation"];
  onAssigned: () => void;
}

export default function AssignSchoolToDelegationModalForm(
  props: AssignSchoolToDelegationModalFormProps
) {
  const dispatch = useStateDispatch();
  const rolesInfo = useRolesInformation();

  const mutation = trpc.delegations.assignSchool.useMutation({
    onSuccess: () => {
      props.onAssigned();
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "School was assigned to the delegation successfully.",
        })
      );
    },
  });

  const delegationNameInfo = useDelegationName(props.delegationData);

  if (delegationNameInfo.isLoading) return null;

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-sm bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Assign School to Delegation
      </ModalHeader>

      <p className="px-4 text-sm">
        This school will be assigned to the delegation:{" "}
        <b>{delegationNameInfo.name}</b>
      </p>

      {rolesInfo.isLoading ? (
        <Spinner />
      ) : (
        <Formik
          onSubmit={(v) =>
            mutation.mutate({ ...v, delegation_id: props.delegationData.id })
          }
          initialValues={{ school_id: -1 }}
          validationSchema={Yup.object({
            school_id: Yup.number()
              .min(0, "Please select a school.")
              .required("Please select a school."),
          })}
        >
          <Form className="p-4">
            <Label htmlFor="school_id" className="w-full bloc mt-4">
              Select the school
              <SearchSchoolField name="school_id" />
            </Label>

            <ModalFooter
              isLoading={mutation.isLoading}
              {...props}
              actionTitle="Assign School"
            />
          </Form>
        </Formik>
      )}
    </Modal>
  );
}
