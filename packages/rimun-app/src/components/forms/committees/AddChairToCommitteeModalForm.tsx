import { Form, Formik } from "formik";
import SearchPersonField from "src/components/fields/base/SearchPersonField";
import SelectRoleField from "src/components/fields/base/SelectRoleField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { CommitteesRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface AddChairToCommitteeModalFormProps extends ModalProps {
  committee: CommitteesRouterOutputs["getCommittee"];
  onCreated: () => void;
}

export default function AddChairToCommitteeModalForm(
  props: AddChairToCommitteeModalFormProps
) {
  const dispatch = useStateDispatch();

  const mutation = trpc.applications.updatePersonApplication.useMutation({
    onSuccess: () => {
      props.setIsVisible(false);
      props.onCreated();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Chair was added/udpated successfully.",
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
        Update Chairs
      </ModalHeader>

      <p className="px-4 text-sm">
        This chair will be added/updated to/in the committee:{" "}
        <b>{props.committee.name}</b>
      </p>

      <Formik
        onSubmit={(v) => {
          console.log(v);
          mutation.mutate(v);
        }}
        initialValues={{
          person_id: -1,
          confirmed_role_id: -1,
          committee_id: props.committee.id,
        }}
        validationSchema={Yup.object({
          person_id: Yup.number()
            .min(0, "Please select a person.")
            .required("Please select a person."),
          confirmed_role_id: Yup.number().required("Please select a role."),
          committee_id: Yup.number(),
        })}
      >
        <Form className="p-4">
          <Label htmlFor="confirmed_role_id" className="w-full">
            What specific role should this chair have?
            <SelectRoleField
              name="confirmed_role_id"
              className="w-full"
              groupName="chair"
            />
          </Label>

          <Label htmlFor="person_id" className="w-full bloc mt-4">
            Select the chair
            <SearchPersonField
              name="person_id"
              filters={{
                application: {
                  status_application: "ACCEPTED",
                  confirmed_group: { name: "chair" },
                },
              }}
            />
          </Label>

          <ModalFooter
            isLoading={mutation.isLoading}
            {...props}
            actionTitle="Add Chair"
          />
        </Form>
      </Formik>
    </Modal>
  );
}
