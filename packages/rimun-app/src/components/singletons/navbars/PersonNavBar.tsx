import {
  CogIcon,
  EnvelopeIcon,
  KeyIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import useAuthenticatedState from "src/utils/useAuthenticatedState";
import NavBarContainer from "./utils/NavBarContainer";
import NavBarLink from "./utils/NavBarLink";

interface PersonNavBarProps {}

const PersonNavBar: React.FC<PersonNavBarProps> = () => {
  const authState = useAuthenticatedState();
  return (
    <NavBarContainer>
      <NavBarLink name="News" to="/dashboard/news" icon={NewspaperIcon} />
      <NavBarLink
        name="Application"
        to="/dashboard/application"
        icon={EnvelopeIcon}
      />
      {(authState.account.is_admin ||
        (authState.account.person?.permissions.length ?? 0) > 0) && (
        <NavBarLink name="Admin" to="/dashboard/admin" icon={KeyIcon} />
      )}
      <NavBarLink name="Settings" to="/dashboard/settings" icon={CogIcon} />
    </NavBarContainer>
  );
};

export default PersonNavBar;
