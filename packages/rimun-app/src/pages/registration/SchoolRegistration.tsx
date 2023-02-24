import RegisterSchoolForm from "src/components/forms/registration/RegisterSchoolForm";

interface SchoolRegistrationProps {
  isNetwork?: boolean;
}

export default function SchoolRegistration(props: SchoolRegistrationProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-100">
      <div className="max-w-lg w-full p-4 shadow-lg border-slate-200 border bg-light rounded-lg">
        <h1 className="text-2xl font-bold">School Registration</h1>
        <p className="mt-2 text-sm">
          Please note that the account that will be created, with specified
          credentials, is linked to your school and will be valid to apply for
          RIMUN each year. We highly recommend to refrain from using personal
          emails. Your newly created account will allow you to continue your
          application process once you log in.
        </p>

        <p className="text-xs mt-2 text-orange-600">
          Attention: this form is not intended for student registration.
        </p>

        <RegisterSchoolForm isNetwork={props.isNetwork} />
      </div>
    </div>
  );
}
