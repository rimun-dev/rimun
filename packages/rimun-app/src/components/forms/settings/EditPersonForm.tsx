import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import CancelButton from "src/components/fields/base/CancelButton";
import SubmitButton from "src/components/fields/base/SubmitButton";
import PartialPersonForm from "src/components/forms/utils/PartialPersonForm";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { ProfilesRouterInputs, ProfilesRouterOutputs, trpc } from "src/trpc";
import phoneNumberValidationSchema from "src/validation/phoneNumber";
import * as Yup from "yup";

interface EditPersonFormProps {
  person: ProfilesRouterOutputs["getPersonProfile"];
  onUpdated: () => void;
}

export default function EditPersonForm(props: EditPersonFormProps) {
  const dispatch = useStateDispatch();
  const navigate = useNavigate();

  const mutation = trpc.profiles.updatePersonProfile.useMutation({
    onSuccess: () => {
      props.onUpdated();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Your personal information was updated successfully.",
        })
      );
    },
  });

  return (
    <Formik
      enableReinitialize
      onSubmit={(v) => mutation.mutate(v)}
      initialValues={
        {
          name: props.person.name,
          surname: props.person.surname,
          birthday: props.person.birthday
            ? new Date(props.person.birthday)
            : undefined,
          gender: props.person.gender,
          phone_number: props.person.phone_number,
          allergies: props.person.allergies,
          country_id: props.person.country_id,
          tshirt_size: props.person.tshirt_size ?? undefined,
        } as ProfilesRouterInputs["updatePersonProfile"]
      }
      validationSchema={Yup.object({
        name: Yup.string().required("Please insert your first name."),
        surname: Yup.string().required("Please insert your last name."),
        birthday: Yup.date()
          .max(new Date(Date.now()), "Your birthday must be in the past.")
          .required("Please insert your last name."),
        gender: Yup.string().oneOf(["m", "f", "nb"]),
        phone_number: phoneNumberValidationSchema.required(
          "Please select a picture for your badge."
        ),
        allergies: Yup.string().nullable(),
        country_id: Yup.number().required("Please select a nationality."),
        tshirt_size: Yup.string().nullable(),
      })}
    >
      {({ dirty }) => (
        <Form className="p-4 bg-white rounded-lg border border-slate-200">
          <PartialPersonForm />

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
