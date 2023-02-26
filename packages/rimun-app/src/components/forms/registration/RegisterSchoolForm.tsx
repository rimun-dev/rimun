import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import PageFormFooter from "src/components/forms/utils/PageFormFooter";
import PartialAccountForm from "src/components/forms/utils/PartialAccountForm";
import PartialSchoolForm from "src/components/forms/utils/PartialSchoolForm";
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
      onSubmit={({ school, account }) =>
        mutation.mutate({
          account: {
            email: account.email,
            password: account.password,
          },
          school: {
            name: school.name,
            is_network: school.is_network,
            country_id: school.country_id,
            address_number: school.address.number,
            address_postal: school.address.postal_code,
            address_street: school.address.street,
            city: school.address.locality,
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

        school: Yup.object({
          name: Yup.string().required("Please insert the name of the school."),
          address: addressValidationSchema,
          is_network: Yup.boolean().required(),
          country_id: Yup.number().required("Please select a country."),
        }),
      })}
      initialValues={{
        account: {
          email: "",
          password: "",
          confirm_password: "",
        },

        school: {
          name: "",
          address: {
            street: "",
            postal_code: "",
            number: "",
            locality: "",
          },
          is_network: !!props.isNetwork,
          country_id: 0,
        },
      }}
    >
      <Form className="mt-4">
        <PartialSchoolForm fieldName="school" />

        <div className="h-2" />

        <PartialAccountForm fieldName="account" />

        <PageFormFooter
          actionTitle="Create Account"
          isLoading={mutation.isLoading}
        />
      </Form>
    </Formik>
  );
}
