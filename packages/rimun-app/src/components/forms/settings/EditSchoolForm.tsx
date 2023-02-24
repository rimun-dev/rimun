import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import CancelButton from "src/components/fields/base/CancelButton";
import SubmitButton from "src/components/fields/base/SubmitButton";
import PartialSchoolForm from "src/components/forms/utils/PartialSchoolForm";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { ProfilesRouterOutputs, trpc } from "src/trpc";
import addressValidationSchema from "src/validation/address";
import * as Yup from "yup";

interface EditSchoolFormProps {
  school: ProfilesRouterOutputs["getSchoolProfile"];
  onUpdated: () => void;
}

export default function EditSchoolForm(props: EditSchoolFormProps) {
  const dispatch = useStateDispatch();
  const navigate = useNavigate();

  const mutation = trpc.profiles.updateSchoolProfile.useMutation({
    onSuccess: () => {
      props.onUpdated();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Your information was updated successfully.",
        })
      );
    },
  });

  return (
    <Formik
      enableReinitialize
      onSubmit={({ address, ...data }) =>
        mutation.mutate({
          ...data,
          address_number: address.number,
          address_postal: address.postal_code,
          address_street: address.street,
          city: address.locality,
        })
      }
      initialValues={{
        name: props.school.name,
        country_id: props.school.country_id,
        address: {
          number: props.school.address_number,
          street: props.school.address_street,
          postal_code: props.school.address_postal,
          locality: props.school.city,
        },
      }}
      validationSchema={Yup.object({
        name: Yup.string(),
        address: addressValidationSchema,
        country_id: Yup.number().required("Please select a country."),
      })}
    >
      {({ dirty }) => (
        <Form className="p-4 bg-white rounded-lg border border-slate-200">
          <PartialSchoolForm />

          <div className="flex mt-6 justify-between">
            <CancelButton
              onClick={() => navigate("/dashboard")}
              className="flex justify-center items-center flex-1 mr-2"
            >
              <ArrowSmallLeftIcon className="mr-2" />
              Go Back
            </CancelButton>

            <SubmitButton
              isLoading={mutation.isLoading}
              disabled={!dirty}
              className="ml-2 flex-1"
            >
              Update
            </SubmitButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
