import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import CancelButton from "src/components/fields/base/CancelButton";
import SubmitButton from "src/components/fields/base/SubmitButton";
import PartialAccountForm from "src/components/forms/utils/PartialAccountForm";
import PartialSchoolForm from "src/components/forms/utils/PartialSchoolForm";
import Icon from "src/components/icons/Icon";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { trpc } from "src/trpc";
import addressValidationSchema from "src/validation/address";
import passwordValidationSchema from "src/validation/password";
import * as Yup from "yup";

interface RegisterSchoolFormProps {
  isNetwork?: boolean;
}

export default function RegisterSchoolForm(props: RegisterSchoolFormProps) {
  const dispatch = useStateDispatch();
  const navigate = useNavigate();

  const mutation = trpc.registration.registerSchool.useMutation({
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
      onSubmit={({ confirm_password, address, ...data }) =>
        mutation.mutate({
          ...data,
          address_number: address.number,
          address_postal: address.postal_code,
          address_street: address.street,
          city: address.locality,
        })
      }
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      validationSchema={Yup.object({
        name: Yup.string().required("Please insert the name of the school."),
        address: addressValidationSchema,
        is_network: Yup.boolean().required(),
        country_id: Yup.number().required("Please select a country."),
        email: Yup.string()
          .email("Please insert a valid email.")
          .required("Please insert an email."),
        password: passwordValidationSchema.required(
          "Please insert a password."
        ),
        confirm_password: Yup.string()
          .oneOf([Yup.ref("password"), undefined], "Passwords do not match.")
          .required("Please confirm your password."),
      })}
      initialValues={{
        name: "",
        address: {
          street: "",
          postal_code: "",
          number: "",
          locality: "",
        },
        is_network: !!props.isNetwork,
        country_id: 0,
        email: "",
        password: "",
        confirm_password: "",
      }}
    >
      {({ errors }) => (
        <Form className="mt-4">
          <PartialSchoolForm />

          <div className="h-2" />

          <PartialAccountForm />

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
              onClick={() => console.log(errors)}
            >
              Create Account
            </SubmitButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
