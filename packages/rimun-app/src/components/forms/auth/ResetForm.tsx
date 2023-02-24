import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import CancelButton from "src/components/fields/base/CancelButton";
import PasswordInputField from "src/components/fields/base/PasswordInputField";
import SubmitButton from "src/components/fields/base/SubmitButton";
import Label from "src/components/fields/base/utils/Label";
import Icon from "src/components/icons/Icon";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { trpc } from "src/trpc";
import passwordValidationSchema from "src/validation/password";
import * as Yup from "yup";

interface ResetFormProps {
  token: string;
}

export default function ResetForm(props: ResetFormProps) {
  const dispatch = useStateDispatch();
  const navigate = useNavigate();
  const mutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Your password has been updated successfully.",
        })
      );
      navigate("/login");
    },
  });

  return (
    <Formik
      onSubmit={(data) => mutation.mutate(data)}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      initialValues={{
        password: "",
        confirm_password: "",
        token: props.token,
      }}
      validationSchema={Yup.object({
        password: passwordValidationSchema.required(
          "Please insert a password."
        ),
        confirm_password: Yup.string()
          .oneOf([Yup.ref("password"), undefined], "Passwords do not match.")
          .required("Please confirm your password."),
        token: Yup.string().required(),
      })}
    >
      {() => (
        <Form>
          <Label htmlFor="password">
            Password
            <PasswordInputField
              name="password"
              placeholder="your-new-password-here"
              className="w-full"
              required
            />
          </Label>

          <div className="h-2" />

          <Label htmlFor="confirm_password">
            Confirm Password
            <PasswordInputField
              name="confirm_password"
              placeholder="your-new-password-here"
              className="w-full"
              required
            />
          </Label>

          <div className="flex mt-6 justify-between">
            <CancelButton
              onClick={() => navigate("/login")}
              className="flex justify-center items-center flex-1 mr-2"
            >
              <Icon name="arrow-sm-left" className="mr-2" />
              Go back
            </CancelButton>

            <SubmitButton
              isLoading={mutation.isLoading}
              className="ml-2 flex-1"
            >
              Submit
            </SubmitButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
