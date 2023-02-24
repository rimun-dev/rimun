import Tag from "src/components/status/Tag";
import PageTitle from "src/components/typography/PageTitle";
import { ProfilesRouterOutputs } from "src/trpc";
import {
  getTagStatusFromApplication,
  getTagStatusFromHousing,
} from "src/utils/status";

interface SchoolApplicationOverviewProps {
  schoolData: ProfilesRouterOutputs["getCurrentSchoolUser"];
}

interface ReviewDataProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
}

function ReviewData({ name, ...props }: ReviewDataProps) {
  return (
    <div className="grid text-sm grid-cols-1 md:grid-cols-2 p-2 bg-slate-50 border border-slate-100 rounded-md">
      <div className="font-semibold">{name}</div>
      <div {...props} />
    </div>
  );
}

export default function SchoolApplicationOverview(
  props: SchoolApplicationOverviewProps
) {
  function getGroupAssignment(groupName: string) {
    return props.schoolData.school_group_assignments.find(
      (a) => a.group.name === groupName
    );
  }

  function renderAssignment(groupName: string, displayName: string) {
    const assignment = getGroupAssignment(groupName);
    return (
      <p>
        You have requested <b>{assignment?.n_requested}</b> {displayName} and{" "}
        <b>
          {assignment?.n_confirmed !== null
            ? assignment?.n_confirmed
            : "we have not confirmed this number yet."}
        </b>{" "}
        {assignment?.n_confirmed !== null && "of them have been confirmed."}
      </p>
    );
  }

  const application = props.schoolData.applications[0];

  return (
    <>
      <PageTitle>School Application Overview</PageTitle>

      <p>
        Here you can review your application status and edit che contact
        information if needed.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <ReviewData name="Submission Date">
          {new Date(application.created_at).toDateString()}
        </ReviewData>
        <ReviewData name="Application Status">
          <Tag
            status={getTagStatusFromApplication(application.status_application)}
          >
            {application.status_application}
          </Tag>
        </ReviewData>
        <ReviewData name="Housing Request">
          <Tag status={getTagStatusFromHousing(application.status_housing)}>
            {application.status_housing}
          </Tag>
        </ReviewData>
        <ReviewData name="Contact Name">
          {`${application.contact_title} ${application.contact_name} ${application.contact_surname}`}
        </ReviewData>
        <ReviewData name="Contact Email">
          {application.contact_email}{" "}
        </ReviewData>

        <div className="mt-4 text-sm flex flex-col gap-1">
          {renderAssignment("delegate", "Delegates")}
          {renderAssignment("chair", "Chairs")}
          {renderAssignment("icj", "ICJ Members")}
          {renderAssignment("staff", "Staff Members")}
        </div>

        <div className="py-2">
          <h3 className="text-sm font-semibold">
            Your previous MUN Experience
          </h3>
          <p className="text-sm p-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-md">
            {application.experience_mun ?? "Not specified."}
          </p>
        </div>

        <div className="py-2">
          <h3 className="text-sm font-semibold">Your special communications</h3>
          <p className="text-sm p-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-md">
            {application.communications ?? "No extra communications."}
          </p>
        </div>
      </div>
    </>
  );
}
