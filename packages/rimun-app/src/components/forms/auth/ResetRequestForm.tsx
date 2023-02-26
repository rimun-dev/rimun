import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import InputField from "src/components/fields/base/TextInputField";
import PageFormFooter from "src/components/forms/utils/PageFormFooter";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { trpc } from "src/trpc";
import * as Yup from "yup";

export default function ResetRequestForm() {
  const dispatch = useStateDispatch();
  const navigate = useNavigate();
  const mutation = trpc.auth.sendResetEmail.useMutation({
    onSuccess: () => {
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message:
            "We have sent you an email with instructions to reset your password.",
        })
      );
      navigate("/login");
    },
  });

  return (
    <Formik
      onSubmit={(v) => mutation.mutate(v.email)}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      initialValues={{ email: "" }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Please insert a valid email.")
          .required("Please insert your email."),
      })}
    >
      {() => (
        <Form>
          <InputField
            name="email"
            type="email"
            placeholder="Email"
            className="w-full"
            required
          />

          <PageFormFooter actionTitle="Submit" isLoading={mutation.isLoading} />
        </Form>
      )}
    </Formik>
  );
}
