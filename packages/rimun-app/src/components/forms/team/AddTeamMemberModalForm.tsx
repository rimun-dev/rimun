import { Form, Formik } from "formik";
import CancelButton from "src/components/fields/base/CancelButton";
import SearchPersonWithoutApplicationField from "src/components/fields/base/SearchPersonFieldWithoutApplication";
import SelectField from "src/components/fields/base/SelectField";
import SubmitButton from "src/components/fields/base/SubmitButton";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import Spinner from "src/components/status/Spinner";
import { trpc } from "src/trpc";
import useRolesInformation from "src/utils/useRolesInformation";
import * as Yup from "yup";

interface AddTeamMemberModalFormProps extends ModalProps {
  onMemberAdded: () => void;
}

export default function AddTeamMemberModalForm(
  props: AddTeamMemberModalFormProps
) {
  const rolesInfo = useRolesInformation();
  const mutation = trpc.team.addTeamMember.useMutation({
    onSuccess: () => {
      props.onMemberAdded();
      props.setIsVisible(false);
    },
  });

  if (rolesInfo.isLoading) return <Spinner />;

  const secretariatId = rolesInfo.getGroupIdByName("secretariat");

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Add New Team Member
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(v) => mutation.mutate(v)}
        initialValues={{
          person_id: -1,
          confirmed_role_id: -1,
        }}
        validationSchema={Yup.object({
          person_id: Yup.number().required("Please select a person."),
          confirmed_role_id: Yup.number().required("Please select a role."),
        })}
      >
        <Form className="p-4">
          <Label htmlFor="confirmed_role_id" className="w-full">
            What role should this team member have?
            <SelectField
              name="confirmed_role_id"
              className="w-full"
              options={rolesInfo.roles
                .filter((r) => r.group_id === secretariatId)
                .map((r) => ({ name: r.name, value: r.id }))}
            />
          </Label>

          <Label htmlFor="person_id" className="w-full bloc mt-4">
            Select the member of the team
            <SearchPersonWithoutApplicationField name="person_id" />
          </Label>

          <div className="flex mt-6 justify-between">
            <CancelButton
              onClick={() => props.setIsVisible(false)}
              className="flex justify-center items-center flex-1 mr-2"
            >
              Cancel
            </CancelButton>

            <SubmitButton
              isLoading={mutation.isLoading}
              className="ml-2 flex-1"
            >
              Add Member
            </SubmitButton>
          </div>
        </Form>
      </Formik>
    </Modal>
  );
}
