import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ResetForm from "src/components/forms/auth/ResetForm";
import { DeviceActions } from "src/store/reducers/device";

export default function PasswordReset() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!params.token) {
      dispatch(
        DeviceActions.displayAlert({
          status: "error",
          message: "Please use a valid link to reset your password.",
        })
      );
      navigate("/login");
    }
  }, [params]);

  if (!params.token) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-100">
      <div className="max-w-xs w-full p-4 shadow-lg border-slate-200 border bg-light rounded-lg">
        <h1 className="text-2xl font-bold">Password Reset</h1>
        <p className="mt-2 mb-4 text-sm">
          Choose a new password for your account.
        </p>
        <ResetForm token={params.token} />
      </div>
    </div>
  );
}
