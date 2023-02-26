import { Form, Formik } from "formik";
import React from "react";
import SelectField from "src/components/fields/base/SelectField";
import SwitchField from "src/components/fields/base/SwitchField";
import TextAreaField from "src/components/fields/base/TextAreaField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import HousingOfferPartialForm from "src/components/forms/applications/utils/HousingOfferPartialForm";
import PageFormFooter from "src/components/forms/utils/PageFormFooter";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { trpc } from "src/trpc";
import * as Yup from "yup";

interface UndergraduateApplicationFormProps {}

const UndergraduateApplicationForm: React.FC<
  UndergraduateApplicationFormProps
> = () => {
  const dispatch = useStateDispatch();

  const trpcCtx = trpc.useContext();

  const mutation = trpc.applications.submitUndergraduateApplication.useMutation(
    {
      onSuccess: () => {
        trpcCtx.profiles.getCurrentPersonUser.invalidate();
        dispatch(
          DeviceActions.displayAlert({
            status: "success",
            message:
              "Your application was succesfully submitted and will be soon be reviewed by the Secretariat.",
          })
        );
      },
    }
  );

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      onSubmit={({ housing_address, ...values }) => {
        return mutation.mutate({
          ...values,
          housing_address_street: housing_address.street,
          housing_address_number: housing_address.number,
          housing_address_postal: housing_address.postal_code,
        });
      }}
      initialValues={{
        city: "",
        university: "",
        eng_certificate: "",
        experience_mun: "",
        experience_other: "",
        is_resident: false,
        housing_is_required: false,
        housing_is_available: false,
        housing_address: {
          street: "",
          postal_code: "",
          number: "",
          locality: "",
        },
        housing_n_guests: 0,
        housing_phone_number: "",
        housing_pets: "",
        housing_gender_preference: undefined,
      }}
      validationSchema={Yup.object({})}
    >
      {({ values }) => (
        <Form className="mt-4">
          <Label htmlFor="is_resident" className="w-full block mt-4">
            Do you live in Rome?
            <SwitchField name="is_resident" />
          </Label>

          {!values.is_resident && (
            <Label htmlFor="city" className="w-full block mt-4">
              What is your city of residence?
              <TextInputField name="city" placeholder="London" />
            </Label>
          )}

          <Label htmlFor="university" className="w-full block mt-4">
            What is your current university?
            <TextInputField name="university" placeholder="Hogwarts" />
          </Label>

          <Label htmlFor="eng_certificate" className="w-full block mt-4">
            What is your English level?
            <SelectField
              name="eng_certificate"
              className="w-full"
              options={["Advanced", "PET", "KET", "TOEFL", "IELTS"].map(
                (c) => ({ name: c, value: c })
              )}
            />
          </Label>

          <Label htmlFor="experience_mun" className="w-full block mt-4">
            Tell us about your previous experiences in other MUNs
            <TextAreaField
              name="experience_mun"
              placeholder="Write about your previous experiences here..."
              className="w-full h-24"
              maxLength={1000}
            />
          </Label>

          <Label htmlFor="experience_other" className="w-full block mt-4">
            Tell us about other relevant experiences that you had
            <TextAreaField
              name="experience_other"
              placeholder="Write about your previous experiences here..."
              className="w-full h-24"
              maxLength={1000}
            />
          </Label>

          {values.is_resident ? (
            <>
              <div className="h-4" />
              <HousingOfferPartialForm
                isAvailable={values.housing_is_available}
              />
            </>
          ) : (
            <Label htmlFor="housing_is_required" className="w-full block mt-4">
              Do you require housing?
              <SwitchField name="housing_is_required" />
            </Label>
          )}

          <div className="h-4" />

          <PageFormFooter
            actionTitle="Submit Application"
            isLoading={mutation.isLoading}
          />
        </Form>
      )}
    </Formik>
  );
};

export default UndergraduateApplicationForm;
