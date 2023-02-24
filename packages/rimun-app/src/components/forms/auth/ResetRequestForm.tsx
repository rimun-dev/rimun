import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import CancelButton from "src/components/fields/base/CancelButton";
import SubmitButton from "src/components/fields/base/SubmitButton";
import InputField from "src/components/fields/base/TextInputField";
import Icon from "src/components/icons/Icon";
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
