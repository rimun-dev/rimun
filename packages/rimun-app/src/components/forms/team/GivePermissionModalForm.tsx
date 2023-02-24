import { Form, Formik } from "formik";
import CancelButton from "src/components/fields/base/CancelButton";
import SearchPersonField from "src/components/fields/base/SearchPersonField";
import SubmitButton from "src/components/fields/base/SubmitButton";
import Label from "src/components/fields/base/utils/Label";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { InfoRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface GivePermissionModalFormProps extends ModalProps {
  resourceData: InfoRouterOutputs["getResources"][0];
  onPermissionGiven: () => void;
}

export default function GivePermissionModalForm({
  resourceData,
  ...props
}: GivePermissionModalFormProps) {
  const mutation = trpc.team.grantPermission.useMutation({
    onSuccess: () => {
      props.onPermissionGiven();
      props.setIsVisible(false);
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Give Admin Permission
      </ModalHeader>

      <p className="px-4">
        Give permission on resource <b>{resourceData.name}</b> to a user.
      </p>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={(v) => mutation.mutate(v)}
        initialValues={{
          person_id: -1,
          resource_id: resourceData.id,
        }}
        validationSchema={Yup.object({
          person_id: Yup.number().required("Please select a person."),
          resource_id: Yup.number().required(),
        })}
      >
        {() => (
          <Form className="p-4">
            <Label htmlFor="person_id" className="w-full bloc mt-4">
              Select a user
              <SearchPersonField name="person_id" />
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
                Give Permission
              </SubmitButton>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
