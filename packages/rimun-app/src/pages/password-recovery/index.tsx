import ResetRequestForm from "src/components/forms/auth/ResetRequestForm";

export default function PasswordRecovery() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-100">
      <div className="max-w-xs w-full p-4 shadow-lg border-slate-200 border bg-light rounded-lg">
        <h1 className="text-2xl font-bold">Password Recovery</h1>
        <p className="mt-2 mb-4 text-sm">
          Insert your account email down below.
        </p>
        <ResetRequestForm />
      </div>
    </div>
  );
}
