import { Form, Formik } from "formik";
import SelectField from "src/components/fields/base/SelectField";
import SelectGroupField from "src/components/fields/base/SelectGroupField";
import SelectRoleField from "src/components/fields/base/SelectRoleField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import Banner from "src/components/status/Banner";
import { SearchRouterOutputs, trpc } from "src/trpc";
import useAuthenticatedState from "src/utils/useAuthenticatedState";
import * as Yup from "yup";

interface EditPersonApplicationModalFormProps extends ModalProps {
  applicationData: SearchRouterOutputs["searchPersons"]["result"][0];
  onApplicationUpdated: () => void;
}

export default function EditPersonApplicationModalForm(
  props: EditPersonApplicationModalFormProps
) {
  const authState = useAuthenticatedState();

  const mutation = trpc.applications.updatePersonApplication.useMutation({
    onSuccess: () => {
      props.onApplicationUpdated();
      props.setIsVisible(false);
    },
  });

  const notAllowedToReassign = authState.account.is_school;

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-md bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Update Application Status
      </ModalHeader>
      <p className="px-4 text-sm">
        Here you can manage the application status for{" "}
        <b>{props.applicationData.person.full_name}</b> and eventually assign
        them to a different group.
      </p>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(values) => {
          if (values.requested_group_id) {
            mutation.mutate({
              person_id: props.applicationData.person_id,
              status_application: values.status_application,
              requested_group_id: values.requested_group_id,
              confirmed_group_id:
                values.status_application === "ACCEPTED"
                  ? values.requested_group_id
                  : undefined,
              confirmed_role_id:
                values.status_application === "ACCEPTED"
                  ? values.confirmed_role_id ?? undefined
                  : undefined,
            });
          } else {
            mutation.mutate({
              person_id: props.applicationData.person_id,
              status_application: values.status_application,
            });
          }
        }}
        initialValues={{
          status_application: props.applicationData.status_application,
          requested_group_id: props.applicationData.requested_group_id,
          confirmed_group_id: props.applicationData.confirmed_group_id,
          confirmed_role_id: props.applicationData.confirmed_role_id,
        }}
        validationSchema={Yup.object({
          status_application: Yup.string()
            .oneOf(["HOLD", "ACCEPTED", "REFUSED"])
            .required("Please select the application status."),
          // requested_group_id: Yup.number().optional(),
          // confirmed_group_id: Yup.number().optional(),
        })}
      >
        {({ values }) => (
          <Form className="p-4">
            <Label htmlFor="status_application" className="w-full">
              Status
              <SelectField
                name="status_application"
                className="w-full"
                options={[
                  { name: "Hold", value: "HOLD" },
                  { name: "Accepted", value: "ACCEPTED" },
                  { name: "Refused", value: "REFUSED" },
                ]}
              />
            </Label>

            {!notAllowedToReassign && (
              <>
                <Label
                  htmlFor="requested_group_id"
                  className="w-full block mt-4"
                >
                  Reassign this person to another group:
                  <SelectGroupField
                    name="requested_group_id"
                    className="w-full"
                  />
                </Label>

                <Label
                  htmlFor="requested_group_id"
                  className="w-full block mt-4"
                >
                  Reassign this person to another role:
                  <SelectRoleField
                    name="confirmed_role_id"
                    className="w-full"
                    groupId={values.requested_group_id ?? undefined}
                  />
                </Label>

                <Banner status="warn" title="Reassign Feature">
                  Bear in mind that only reassigning a person to another group
                  will simply move their application in the specified group. You
                  will still have to update the application status if you also
                  want to accept them.
                </Banner>
              </>
            )}

            <ModalFooter
              isLoading={mutation.isLoading}
              {...props}
              actionTitle="Update Application"
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
