import {
  AcademicCapIcon,
  Cog8ToothIcon,
  EnvelopeIcon,
  FlagIcon,
  NewspaperIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import useAuthenticatedState from "src/utils/useAuthenticatedState";
import NavBarContainer from "./utils/NavBarContainer";
import NavBarLink from "./utils/NavBarLink";

interface SchoolNavBarProps {}

const SchoolNavBar: React.FC<SchoolNavBarProps> = () => {
  const authState = useAuthenticatedState();
  const hasApplied = authState.account.school!.applications.length > 0;
  return (
    <NavBarContainer>
      <NavBarLink name="News" to="/dashboard/news" icon={NewspaperIcon} />
      <NavBarLink
        name="Application"
        to="/dashboard/application"
        icon={EnvelopeIcon}
      />
      <NavBarLink
        name="Students"
        to="/dashboard/students"
        icon={UserGroupIcon}
        active={hasApplied}
      />
      <NavBarLink
        name="Teachers"
        to="/dashboard/teachers"
        icon={AcademicCapIcon}
        active={hasApplied}
      />
      <NavBarLink
        name="Delegates"
        to="/dashboard/delegations"
        icon={FlagIcon}
        active={hasApplied}
      />
      <NavBarLink
        name="Settings"
        to="/dashboard/settings"
        icon={Cog8ToothIcon}
      />
    </NavBarContainer>
  );
};

export default SchoolNavBar;
