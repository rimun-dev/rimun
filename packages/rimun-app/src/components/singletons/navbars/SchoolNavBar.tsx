import {
  AcademicCapIcon,
  CogIcon,
  EnvelopeIcon,
  FlagIcon,
  NewspaperIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import NavBarContainer from "./utils/NavBarContainer";
import NavBarLink from "./utils/NavBarLink";

interface SchoolNavBarProps {}

const SchoolNavBar: React.FC<SchoolNavBarProps> = () => {
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
      />
      <NavBarLink
        name="Teachers"
        to="/dashboard/teachers"
        icon={AcademicCapIcon}
      />
      <NavBarLink
        name="Delegates"
        to="/dashboard/delegations"
        icon={FlagIcon}
      />
      <NavBarLink name="Settings" to="/dashboard/settings" icon={CogIcon} />
    </NavBarContainer>
  );
};

export default SchoolNavBar;
