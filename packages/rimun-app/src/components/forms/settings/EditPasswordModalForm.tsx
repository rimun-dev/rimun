import { Form, Formik } from "formik";
import PasswordInputField from "src/components/fields/base/PasswordInputField";
import Label from "src/components/fields/base/utils/Label";
import ModalFooter from "src/components/forms/utils/ModalFooter";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { ProfilesRouterOutputs, trpc } from "src/trpc";
import passwordValidationSchema from "src/validation/password";
import * as Yup from "yup";

interface EditPasswordModalFormProps extends ModalProps {
  account: ProfilesRouterOutputs["getPersonProfile"]["account"];
  onUpdated: () => void;
}

export default function EditPasswordModalForm(
  props: EditPasswordModalFormProps
) {
  const dispatch = useStateDispatch();

  const mutation = trpc.profiles.updateAccount.useMutation({
    onSuccess: () => {
      props.onUpdated();
      props.setIsVisible(false);
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Your password was updated successfully.",
        })
      );
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-xl bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Update Password
      </ModalHeader>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
        onSubmit={({ password }) => mutation.mutate({ password })}
        initialValues={{ password: "", confirm_password: "" }}
        validationSchema={Yup.object({
          password: passwordValidationSchema.required(
            "Please insert a password."
          ),
          confirm_password: Yup.string()
            .oneOf([Yup.ref("password"), undefined], "Passwords do not match.")
            .required("Please confirm your password."),
        })}
      >
        <Form className="p-4">
          <Label htmlFor="password">
            Password
            <PasswordInputField
              name="password"
              placeholder="your-password-here"
              className="w-full"
              required
            />
          </Label>

          <div className="h-2" />

          <Label htmlFor="confirm_password">
            Confirm Password
            <PasswordInputField
              name="confirm_password"
              placeholder="your-password-here"
              className="w-full"
              required
            />
          </Label>

          <ModalFooter
            actionTitle="Update Password"
            setIsVisible={props.setIsVisible}
            isLoading={mutation.isLoading}
          />
        </Form>
      </Formik>
    </Modal>
  );
}
