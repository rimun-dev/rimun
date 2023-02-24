import {
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  DocumentDuplicateIcon,
  EnvelopeIcon,
  EyeSlashIcon,
  FlagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  PhotoIcon,
  QuestionMarkCircleIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import useAuthenticatedState from "src/utils/useAuthenticatedState";
import usePermissionsInformation from "src/utils/usePermissionsInfo";

export default function AdminPanel() {
  const authState = useAuthenticatedState();
  const permissionsInfo = usePermissionsInformation();

  if (permissionsInfo.isLoading) return <Spinner />;

  const isNotAuthorized = (resource: string) =>
    authState.account.is_school ||
    (!authState.account.is_admin &&
      !authState.account?.person?.permissions.find(
        (p) => p.resource_id === permissionsInfo.getResourceIdByName(resource)
      ));

  return (
    <>
      <PageTitle>Administration Panel</PageTitle>
      <div className="rounded-lg border border-slate-200 bg-white p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4 shadow-sm">
        <AdminPanelItem
          name="Search"
          path="search"
          icon={MagnifyingGlassIcon}
          description="Quickly find attendees or schools"
        />
        <AdminPanelItem
          name="Applications"
          path="applications"
          icon={EnvelopeIcon}
          description="Manage applications and attendance"
          isDisabled={isNotAuthorized("application")}
        />
        <AdminPanelItem
          name="Team"
          path="team"
          icon={UserGroupIcon}
          description="Manage the Secretariat members"
          isDisabled={isNotAuthorized("team")}
        />
        <AdminPanelItem
          name="Housing"
          path="housing"
          icon={BuildingOfficeIcon}
          description="Manage the housing requests"
          isDisabled={isNotAuthorized("housing")}
        />
        <AdminPanelItem
          name="Committees"
          path="committees"
          icon={BriefcaseIcon}
          description="Manage the forums' composition"
          isDisabled={isNotAuthorized("committee")}
        />
        <AdminPanelItem
          name="Delegations"
          path="delegations"
          icon={FlagIcon}
          description="Create and assign delegations"
          isDisabled={isNotAuthorized("delegation")}
        />
        <AdminPanelItem
          name="Directors"
          path="directors"
          icon={AcademicCapIcon}
          description="View the list of MUN Directors"
        />
        <AdminPanelItem
          name="Exports"
          path="exports"
          icon={DocumentArrowDownIcon}
          description="Download PDF and Excel files"
          isDisabled
        />
        <AdminPanelItem
          name="Gallery"
          path="gallery"
          icon={PhotoIcon}
          description="Manage the public photo gallery"
        />
        <AdminPanelItem
          name="Documents"
          path="documents"
          icon={DocumentDuplicateIcon}
          description="Upload conference resources"
          isDisabled={isNotAuthorized("document")}
        />
        <AdminPanelItem
          name="FAQs"
          path="faqs"
          icon={QuestionMarkCircleIcon}
          description="Edit frequently asked questions"
          isDisabled={isNotAuthorized("faq")}
        />
        <AdminPanelItem
          name="Permissions"
          path="permissions"
          icon={EyeSlashIcon}
          description="Manage permissions for the team"
        />
        <AdminPanelItem
          name="Session"
          path="sessions"
          icon={CalendarDaysIcon}
          description="Start/manage RIMUN sessions."
          isDisabled
        />
        <AdminPanelItem
          name="Hall of Fame"
          path="hall-of-fame"
          icon={TrophyIcon}
          description="Manage events in the timeline."
          isDisabled
        />
        <AdminPanelItem
          name="Sponsors"
          path="sponsors"
          icon={HeartIcon}
          description="Add/remove sponsors' logos."
          isDisabled
        />
      </div>
    </>
  );
}

interface AdminPanelItemProps {
  name: string;
  icon: typeof PhoneIcon;
  path: string;
  description: string;
  isDisabled?: boolean;
}

function AdminPanelItem(props: AdminPanelItemProps) {
  const [isOvered, setIsOvered] = React.useState(false);
  const navigate = useNavigate();

  const Icon = props.icon;

  return (
    <button
      type="button"
      disabled={props.isDisabled}
      onClick={() => navigate(`/dashboard/admin/${props.path}`)}
      className={`transition-colors rounded-md border border-slate-200 p-2 flex items-center text-left gap-4 hover:bg-blue-200 hover:bg-opacity-20 ${
        props.isDisabled ? "opacity-25" : undefined
      }`}
      onMouseEnter={() => setIsOvered(true)}
      onMouseLeave={() => setIsOvered(false)}
    >
      <div className="w-12 h-12 bg-slate-50 rounded-lg flex justify-center items-center">
        <Icon
          className={`w-7 h-7 ${isOvered ? "text-blue-600" : "text-brand "}`}
        />
      </div>
      <div>
        <h3 className="text-sm font-bold">{props.name}</h3>
        <p className="text-xs text-slate-600">{props.description}</p>
      </div>
    </button>
  );
}
