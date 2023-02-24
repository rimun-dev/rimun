import SchoolApplicationForm from "src/components/forms/applications/SchoolApplicationForm";
import PageTitle from "src/components/typography/PageTitle";

export default function SchoolApplicationAction() {
  return (
    <>
      <div className="w-full border-b pb-4">
        <PageTitle>School Application</PageTitle>
        <p className="mt-2">
          Please fill in the following form in order to apply for this year's
          session.
        </p>
      </div>
      <SchoolApplicationForm />
    </>
  );
}
