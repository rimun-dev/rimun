import UndergraduateApplicationForm from "src/components/forms/applications/UndergraduateApplicationForm";

export default function UndergraduateApplication() {
  return (
    <>
      <div className="w-full border-b pb-4">
        <h1 className="text-2xl font-bold">
          Undergraduate Student Application
        </h1>
        <p className="mt-2">
          Please fill in the following form in order to apply for this year's
          session.
        </p>
      </div>
      <UndergraduateApplicationForm />
    </>
  );
}
