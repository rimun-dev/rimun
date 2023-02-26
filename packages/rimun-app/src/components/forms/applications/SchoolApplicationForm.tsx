import { Form, Formik } from "formik";
import NumberInputField from "src/components/fields/base/NumberInputField";
import SelectField from "src/components/fields/base/SelectField";
import SwitchField from "src/components/fields/base/SwitchField";
import TextAreaField from "src/components/fields/base/TextAreaField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";
import PageFormFooter from "src/components/forms/utils/PageFormFooter";
import Banner from "src/components/status/Banner";
import Spinner from "src/components/status/Spinner";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { trpc } from "src/trpc";
import useAuthenticatedState from "src/utils/useAuthenticatedState";
import * as Yup from "yup";

export default function SchoolApplicationForm() {
  const authState = useAuthenticatedState();
  const dispatch = useStateDispatch();

  const trpcCtx = trpc.useContext();

  const mutation = trpc.applications.submitSchoolApplication.useMutation({
    onSuccess: () => {
      trpcCtx.profiles.getCurrentSchoolUser.invalidate();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message:
            "Your application was succesfully submitted and will be soon be reviewed by the Secretariat.",
        })
      );
    },
  });

  const is_network = authState.account.school?.is_network;

  const groupsQuery = trpc.info.getGroups.useQuery();

  if (!groupsQuery.data || groupsQuery.isLoading) return <Spinner />;

  return (
    <Formik
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      onSubmit={(v) => mutation.mutate(v)}
      initialValues={{
        housing_is_required: false,
        contact_title: "Mr.",
        contact_name: "",
        contact_surname: "",
        contact_email: "",
        experience_mun: "",
        communications: "",
        assignments: [
          {
            group_id: groupsQuery.data.find((g) => g.name === "delegate")!.id,
            n_requested: 0,
          },
          {
            group_id: groupsQuery.data.find((g) => g.name === "chair")!.id,
            n_requested: 0,
          },
          {
            group_id: groupsQuery.data.find((g) => g.name === "icj")!.id,
            n_requested: 0,
          },
          {
            group_id: groupsQuery.data.find((g) => g.name === "staff")!.id,
            n_requested: 0,
          },
        ],
      }}
      validationSchema={Yup.object({
        housing_is_required: Yup.boolean().required(),
        contact_title: Yup.string().required(
          "Please select a title for the primary MUN director"
        ),
        contact_name: Yup.string().required(
          "Please insert the name of the primary MUN director"
        ),
        contact_surname: Yup.string().required(
          "Please insert the surname of the primary MUN director"
        ),
        contact_email: Yup.string().required(
          "Please insert the email of the primary MUN director"
        ),
        experience_mun: Yup.string(),
        communications: Yup.string(),
        assignments: Yup.array(
          Yup.object({
            group_id: Yup.mixed().required(),
            n_requested: Yup.number()
              .min(
                0,
                "Please select a number greater than or equal to 0 for each group."
              )
              .required("Please select the number of students for each group."),
          })
        ).required("Please select the number of students for each group."),
      })}
    >
      <Form className="mt-4">
        <h3 className="w-full text-sm font-bold">Your students</h3>
        <p className="w-full text-xs mt-2">
          Please insert the number of students your will be taking to RIMUN. We
          remind that the Secretariat can change the number of students from
          your school.
        </p>

        <div className="flex gap-4 my-4">
          <div className="flex flex-col gap-2 items-center">
            <NumberInputField
              name="assignments[0].n_requested"
              min={0}
              className="w-16"
            />
            <span className="text-xs">Delegates</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <NumberInputField
              name="assignments[1].n_requested"
              min={0}
              className="w-16"
            />
            <span className="text-xs">Chairs</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <NumberInputField
              name="assignments[2].n_requested"
              min={0}
              className="w-16"
            />
            <span className="text-xs">ICJ</span>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <NumberInputField
              name="assignments[3].n_requested"
              min={0}
              className="w-16"
            />
            <span className="text-xs">Staff</span>
          </div>
        </div>

        {!is_network && (
          <>
            <Label htmlFor="housing_is_required" className="w-full">
              Do you require housing for your students?
              <SwitchField name="housing_is_required" className="w-full" />
            </Label>
            <Banner status="warn" title="Housing Disclaimer">
              Please keep in mind that the Secretariat cannot offer housing for
              every school but for a limited number of people, usually 120
              foreign students.
            </Banner>
          </>
        )}

        <div className="h-4" />

        <Label htmlFor="experience_mun" className="w-full">
          Tell us about your previous experiences in other MUNs
          <TextAreaField
            name="experience_mun"
            placeholder="Write about your students' previous experiences here..."
            className="w-full h-24"
            maxLength={1000}
          />
        </Label>

        <div className="h-4" />

        <Label htmlFor="communications" className="w-full">
          Do you have any special communications of which you want to inform the
          secretariat?
          <TextAreaField
            name="communications"
            placeholder="Write your communication here..."
            className="w-full h-24"
            maxLength={1000}
          />
        </Label>

        <div className="h-4" />

        <h3 className="w-full text-sm font-bold">
          Primary MUN Director contact details
        </h3>
        <p className="w-full text-xs mt-2">
          Please fill in the contact information regarding the primary MUN
          Director for this session of RIMUN. We will use this email to notify
          you of your application status and to contact you with any other
          information.
        </p>

        <div className="h-4" />

        <Label htmlFor="contact_title">
          <p>Title</p>
          <SelectField
            name="contact_title"
            options={[
              { name: "Mr.", value: "Mr." },
              { name: "Ms.", value: "Ms." },
              { name: "Mrs.", value: "Mrs." },
              { name: "Miss", value: "Miss" },
            ]}
          />
        </Label>
        <div className="flex flex-col md:flex-row gap-2 py-2">
          <Label htmlFor="contact_name" className="md:w-1/2">
            First Name
            <TextInputField
              name="contact_name"
              placeholder="John"
              className="w-full"
            />
          </Label>
          <Label htmlFor="contact_name" className="md:w-1/2">
            Last Name
            <TextInputField
              name="contact_surname"
              placeholder="Doe"
              className="w-full"
            />
          </Label>
        </div>

        <Label htmlFor="contact_email">
          Email
          <TextInputField
            name="contact_email"
            placeholder="john.doe@gmail.com"
            className="w-full"
          />
        </Label>

        <PageFormFooter
          actionTitle="Submit Application"
          isLoading={mutation.isLoading}
        />
      </Form>
    </Formik>
  );
}
