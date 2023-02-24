import HighSchoolApplicationForm from "src/components/forms/applications/HighSchoolApplicationForm";

export default function HighSchoolApplication() {
  return (
    <>
      <div className="w-full border-b pb-4">
        <h1 className="text-2xl font-bold">High School Student Application</h1>
        <p className="mt-2">
          Please fill in the following form in order to apply for this year's
          session.
        </p>
      </div>
      <HighSchoolApplicationForm />
    </>
  );
}
