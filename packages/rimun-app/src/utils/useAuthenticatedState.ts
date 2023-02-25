import { useStateSelector } from "src/store";
import { AuthenticatedAuthState } from "src/store/reducers/auth";

export default function useAuthenticatedState(): AuthenticatedAuthState {
  const authState = useStateSelector((s) => s.auth);
  if (!authState.isAuthenticated)
    throw new Error(
      "The hook `useAuthenticatedState` must be called for sections of the app where the user is known to be authenticated."
    );
  return authState;
}
