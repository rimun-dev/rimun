import RegisterPersonForm from "src/components/forms/registration/RegisterPersonForm";

export default function PersonRegistration() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-100">
      <div className="max-w-lg w-full p-4 shadow-lg border-slate-200 border bg-light rounded-lg">
        <h1 className="text-2xl font-bold">Student Registration</h1>
        <p className="mt-2 text-sm">
          Please note that the account that will be created will be valid to
          apply for RIMUN each year. You will be able to continue your
          application process once you log in.
        </p>
        <RegisterPersonForm />
      </div>
    </div>
  );
}
