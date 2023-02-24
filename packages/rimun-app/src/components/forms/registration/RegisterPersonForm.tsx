import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import CancelButton from "src/components/fields/base/CancelButton";
import ImagePreviewField from "src/components/fields/base/ImagePreviewField";
import SubmitButton from "src/components/fields/base/SubmitButton";
import Label from "src/components/fields/base/utils/Label";
import PartialAccountForm from "src/components/forms/utils/PartialAccountForm";
import PartialPersonForm from "src/components/forms/utils/PartialPersonForm";
import Icon from "src/components/icons/Icon";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { RegistrationRouterInputs, trpc } from "src/trpc";
import passwordValidationSchema from "src/validation/password";
import phoneNumberValidationSchema from "src/validation/phoneNumber";
import * as Yup from "yup";

export default function RegisterPersonForm() {
  const dispatch = useStateDispatch();
  const navigate = useNavigate();

  const mutation = trpc.registration.registerPerson.useMutation({
    onSuccess: () => {
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Your account was successfully created, you can now log in.",
        })
      );
      navigate("/login");
    },
  });

  return (
    <Formik
      onSubmit={({ confirm_password, ...data }) => mutation.mutate(data)}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={Yup.object({
        email: Yup.string()
          .email("Please insert a valid email.")
          .required("Please insert an email."),
        password: passwordValidationSchema.required(
          "Please insert a password."
        ),
        confirm_password: Yup.string()
          .oneOf([Yup.ref("password"), undefined], "Passwords do not match.")
          .required("Please confirm your password."),
        name: Yup.string().required("Please insert your first name."),
        surname: Yup.string().required("Please insert your last name."),
        birthday: Yup.date()
          .max(new Date(Date.now()), "Your birthday must be in the past.")
          .required("Please insert your last name."),
        gender: Yup.string().oneOf(["m", "f", "nb"]),
        picture: Yup.string().required(
          "Please select a picture for your badge."
        ),
        phone_number: phoneNumberValidationSchema.required(
          "Please insert a phone number."
        ),
        allergies: Yup.string(),
        country_id: Yup.number().required("Please select a nationality."),
        tshirt_size: Yup.string(),
      })}
      initialValues={
        {
          email: "",
          password: "",
          confirm_password: "",
          name: "",
          surname: "",
          birthday: new Date(),
          gender: "m",
          picture: "",
          phone_number: "",
          allergies: "",
          country_id: 0,
          tshirt_size: "s",
        } as RegistrationRouterInputs["registerPerson"] & {
          confirm_password: string;
        }
      }
    >
      {() => (
        <Form className="mt-4">
          <PartialAccountForm />

          <div className="h-4" />

          <Label htmlFor="picture" className="md:ml-1">
            Badge Picture
            <ImagePreviewField name="picture" />
          </Label>

          <div className="h-4" />

          <PartialPersonForm />

          <div className="flex mt-6 justify-between">
            <CancelButton
              onClick={() => navigate("/registration")}
              className="flex justify-center items-center flex-1 mr-2"
            >
              <Icon name="arrow-sm-left" className="mr-2" />
              Go Back
            </CancelButton>

            <SubmitButton
              isLoading={mutation.isLoading}
              className="ml-2 flex-1"
            >
              Create Account
            </SubmitButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
