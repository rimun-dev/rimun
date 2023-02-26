import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import SubmitButton from "src/components/buttons/SubmitButton";
import PasswordInputField from "src/components/fields/base/PasswordInputField";
import InputField from "src/components/fields/base/TextInputField";
import { useStateDispatch } from "src/store";
import { AuthActions } from "src/store/reducers/auth";
import { trpc } from "src/trpc";
import * as Yup from "yup";

export default function LoginForm() {
  const dispatch = useStateDispatch();
  const navigate = useNavigate();
  const mutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      dispatch(AuthActions.login(data));
      navigate("/dashboard/news");
    },
  });

  return (
    <Formik
      onSubmit={(v) => mutation.mutate(v)}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required(),
      })}
    >
      {({ values }) => (
        <Form>
          <InputField
            name="email"
            type="email"
            placeholder="Email"
            className="w-full"
            required
          />

          <PasswordInputField
            name="password"
            placeholder="Password"
            required
            className="w-full mt-2"
          />

          <div className="flex mt-4 justify-end">
            <Link
              to="/password-recovery"
              className="text-xs text-brand hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <SubmitButton
            isLoading={mutation.isLoading}
            className={`w-full mt-4 ${
              values.email && values.password ? "bg-opacity-75" : undefined
            }`}
          >
            Sign In
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
