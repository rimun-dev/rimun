import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import ImagePreviewField from "src/components/fields/base/ImagePreviewField";
import Label from "src/components/fields/base/utils/Label";
import PageFormFooter from "src/components/forms/utils/PageFormFooter";
import PartialAccountForm from "src/components/forms/utils/PartialAccountForm";
import PartialPersonForm from "src/components/forms/utils/PartialPersonForm";
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
      onSubmit={({ account, person }) =>
        mutation.mutate({
          person,
          account: {
            email: account.email,
            password: account.password,
          },
        })
      }
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={Yup.object({
        account: Yup.object({
          email: Yup.string()
            .email("Please insert a valid email.")
            .required("Please insert an email."),
          password: passwordValidationSchema.required(
            "Please insert a password."
          ),
          confirm_password: Yup.string()
            .oneOf([Yup.ref("password"), undefined], "Passwords do not match.")
            .required("Please confirm your password."),
        }),

        person: Yup.object({
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
        }),
      })}
      initialValues={
        {
          account: {
            email: "",
            password: "",
            confirm_password: "",
          },
          person: {
            name: "",
            surname: "",
            birthday: new Date(),
            gender: "m",
            picture: "",
            phone_number: "",
            allergies: "",
            country_id: 0,
            tshirt_size: "s",
          },
        } as RegistrationRouterInputs["registerPerson"] & {
          account: { confirm_password: string };
        }
      }
    >
      {() => (
        <Form className="mt-4">
          <PartialAccountForm fieldName="account" />

          <div className="h-4" />

          <Label htmlFor="person.picture" className="md:ml-1">
            Badge Picture
            <ImagePreviewField name="person.picture" />
          </Label>

          <div className="h-4" />

          <PartialPersonForm fieldName="person" />

          <PageFormFooter
            actionTitle="Create Account"
            isLoading={mutation.isLoading}
          />
        </Form>
      )}
    </Formik>
  );
}
