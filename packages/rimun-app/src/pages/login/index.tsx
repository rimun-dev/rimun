import { Link } from "react-router-dom";
import Logo from "src/components/brand/Logo";
import LoginForm from "src/components/forms/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-100">
      <div className="-mt-20 w-full flex flex-col items-center justify-center">
        <div className="w-20 h-20">
          <Logo />
        </div>

        <div className="max-w-xs w-full p-4 mt-4 shadow-lg border-slate-200 border bg-light rounded-lg">
          <LoginForm />
        </div>

        <div className="max-w-xs w-full mt-4 text-center text-sm">
          Don&apos;t have an account yet?
          <Link
            to="/registration"
            className="text-brand ml-2 hover:underline font-bold"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
