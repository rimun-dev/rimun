import { Form, Formik } from "formik";
import React from "react";
import SubmitButton from "src/components/buttons/SubmitButton";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import EditPasswordModalForm from "src/components/forms/settings/EditPasswordModalForm";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { ProfilesRouterOutputs, trpc } from "src/trpc";
import * as Yup from "yup";

interface EditAccountFormProps {
  account: ProfilesRouterOutputs["getPersonProfile"]["account"];
  onUpdated: () => void;
}

export default function EditAccountForm(props: EditAccountFormProps) {
  const [showPswModal, setShowPswModal] = React.useState(false);

  const dispatch = useStateDispatch();

  const mutation = trpc.profiles.updateAccount.useMutation({
    onSuccess: () => {
      props.onUpdated();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Your account was updated successfully.",
        })
      );
    },
  });

  return (
    <>
      <Formik
        onSubmit={(v) => mutation.mutate(v)}
        initialValues={{ email: props.account?.email }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Please insert a valid email")
            .required("Your email is required"),
        })}
      >
        {({ dirty }) => (
          <Form className="p-4 bg-white rounded-lg border border-slate-200">
            <Label htmlFor="email">
              Email
              <TextInputField
                name="email"
                placeholder="example@gmail.com"
                className="w-full"
                required
              />
            </Label>
            <div className="h-2" />

            <div className="md:flex justify-between items-center">
              <SubmitButton
                isLoading={mutation.isLoading}
                disabled={!dirty}
                className="flex-0"
              >
                Update Email
              </SubmitButton>
              <p
                className="font-bold text-sm hover:underline text-brand cursor-pointer mt-2 md:mt-0 text-right"
                onClick={() => setShowPswModal(!showPswModal)}
              >
                Want to change your password?
              </p>
            </div>
          </Form>
        )}
      </Formik>

      <EditPasswordModalForm
        {...props}
        isVisible={showPswModal}
        setIsVisible={setShowPswModal}
      />
    </>
  );
}
