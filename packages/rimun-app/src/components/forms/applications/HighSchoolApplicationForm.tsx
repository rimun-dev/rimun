import { Form, Formik } from "formik";
import React from "react";
import SelectField from "src/components/fields/base/SelectField";
import SelectGroupField from "src/components/fields/base/SelectGroupField";
import SelectRoleField from "src/components/fields/base/SelectRoleField";
import TextAreaField from "src/components/fields/base/TextAreaField";
import Label from "src/components/fields/base/utils/Label";
import HousingOfferPartialForm from "src/components/forms/applications/utils/HousingOfferPartialForm";
import PageFormFooter from "src/components/forms/utils/PageFormFooter";
import Banner from "src/components/status/Banner";
import Spinner from "src/components/status/Spinner";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { trpc } from "src/trpc";
import * as Yup from "yup";

interface HighSchoolApplicationFormProps {}

const HighSchoolApplicationForm: React.FC<
  HighSchoolApplicationFormProps
> = () => {
  const dispatch = useStateDispatch();

  const trpcCtx = trpc.useContext();

  const mutation = trpc.applications.submitHighSchoolApplication.useMutation({
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
  });

  const schoolsQuery = trpc.search.searchSchools.useQuery({
    limit: Number.MAX_SAFE_INTEGER,
    filters: { application: { status_application: "ACCEPTED" } },
  });

  const groupsQuery = trpc.info.getGroups.useQuery(undefined, {
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  if (
    schoolsQuery.isLoading ||
    !schoolsQuery.data ||
    groupsQuery.isLoading ||
    !groupsQuery.data
  )
    return <Spinner />;

  const networkSchoolsIds = schoolsQuery.data.result
    .filter((s) => s.school.is_network)
    .map((s) => s.school_id);

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      onSubmit={({ housing_address, ...values }) => {
        console.debug(values);
        return mutation.mutate({
          ...values,
          housing_address_street: housing_address.street,
          housing_address_number: housing_address.number,
          housing_address_postal: housing_address.postal_code,
        });
      }}
      initialValues={{
        school_id: -1,
        school_year: 1,
        school_section: "",
        eng_certificate: "",
        experience_mun: "",
        experience_other: "",
        requested_group_id: -1,
        requested_role_id: undefined,
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
      validationSchema={Yup.object({
        school_id: Yup.string().required("Please select a school."),
      })}
    >
      {({ values, touched }) => {
        const isNetworkSelected = networkSchoolsIds.includes(values.school_id);
        const isStaffSelected =
          values.requested_group_id ===
          groupsQuery.data.find((g) => g.name === "staff")!.id;

        return (
          <Form className="mt-4">
            <Label htmlFor="school_id" className="w-full">
              Select your school
              <SelectField
                name="school_id"
                className="w-full"
                options={schoolsQuery.data.result.map((s) => ({
                  name: s.school.name,
                  value: s.school_id,
                }))}
              />
            </Label>

            {!touched.school_id && (
              <Banner status="warn" title="Can't find your school?">
                It is possible that your school's application has not been
                accepted yet. You can only proceed with your individual
                application once your school has been accepted. Please refer to
                your MUN director to stay updated on your school's application
                status.
              </Banner>
            )}

            <div className="h-4" />

            <Label htmlFor="requested_group_id" className="w-full">
              What is your role preference?
              <SelectGroupField name="requested_group_id" className="w-full" />
            </Label>

            {isStaffSelected && isNetworkSelected && (
              <>
                <div className="h-4" />

                <Label htmlFor="requested_role_id" className="w-full">
                  What is your staff role preference?
                  <SelectRoleField
                    name="requested_role_id"
                    className="w-full"
                    groupName="staff"
                  />
                </Label>
              </>
            )}

            <div className="h-4" />

            <Label htmlFor="eng_certificate" className="w-full">
              What is your English level?
              <SelectField
                name="eng_certificate"
                className="w-full"
                options={["Advanced", "PET", "KET", "TOEFL", "IELTS"].map(
                  (c) => ({ name: c, value: c })
                )}
              />
            </Label>

            <div className="h-4" />

            <Label htmlFor="experience_mun" className="w-full">
              Tell us about your previous experiences in other MUNs
              <TextAreaField
                name="experience_mun"
                placeholder="Write about your previous experiences here..."
                className="w-full h-24"
                maxLength={1000}
              />
            </Label>

            <div className="h-4" />

            <Label htmlFor="experience_other" className="w-full">
              Tell us about other relevant experiences that you had
              <TextAreaField
                name="experience_other"
                placeholder="Write about your previous experiences here..."
                className="w-full h-24"
                maxLength={1000}
              />
            </Label>

            {isNetworkSelected && (
              <>
                <div className="h-4" />
                <HousingOfferPartialForm
                  isAvailable={values.housing_is_available}
                />
              </>
            )}

            <div className="h-4" />

            <PageFormFooter
              actionTitle="Submit Application"
              isLoading={mutation.isLoading}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default HighSchoolApplicationForm;
