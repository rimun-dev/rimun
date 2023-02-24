import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Tag from "src/components/status/Tag";
import PageTitle from "src/components/typography/PageTitle";
import { ProfilesRouterOutputs } from "src/trpc";
import {
  getTagStatusFromApplication,
  getTagStatusFromHousing,
} from "src/utils/status";

interface PersonApplicationOverviewProps {
  personData: ProfilesRouterOutputs["getPersonProfile"];
}

export default function PersonApplicationOverview(
  props: PersonApplicationOverviewProps
) {
  // NOTE: router returns only the current session's application
  const application = props.personData.applications[0];

  return (
    <>
      <PageTitle>Application Overview</PageTitle>

      <p>Here you can review your application status.</p>

      <div className="my-6 flex flex-col gap-2">
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
        {application.status_housing !== "NOT_REQUIRED" && (
          <ReviewData name="Housing Request">
            <Tag status={getTagStatusFromHousing(application.status_housing)}>
              {application.status_housing}
            </Tag>
          </ReviewData>
        )}
        <ReviewData name="Role Preference">
          {application.requested_role?.name}
        </ReviewData>
        <ReviewData name="Confirmed Role">
          {application.status_application === "ACCEPTED"
            ? application.confirmed_role?.name
            : "Your role has not been confirmed yet."}
        </ReviewData>

        <div className="py-2">
          <h3 className="text-sm font-semibold">
            Your previous MUN Experience
          </h3>
          <p className="text-sm p-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-md">
            {application.experience_mun ?? "Not specified."}
          </p>
        </div>

        <div className="py-2">
          <h3 className="text-sm font-semibold">Your other experiences</h3>
          <p className="text-sm p-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-md">
            {application.experience_other ?? "Not specified."}
          </p>
        </div>
      </div>

      <PageTitle>Housing Overview</PageTitle>

      <p>Here you can review the status of your housing request/offer.</p>

      {application.housing_is_available ? (
        (application.housing_n_guests ?? 0) > 0 ? (
          <HostMatches matches={props.personData.host_matches} />
        ) : (
          <p className="text-xs">
            You have not agreed to host other attendees.
          </p>
        )
      ) : (
        <GuestMatch match={props.personData.guest_matches[0]} />
      )}
    </>
  );
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

interface HostMatchesProps {
  matches: ProfilesRouterOutputs["getPersonProfile"]["host_matches"];
}

function HostMatches(props: HostMatchesProps) {
  if (props.matches.length === 0)
    return <p className="text-xs">No guests assigned yet.</p>;
  return (
    <div className="flex flex-col gap-2 mt-4">
      <p className="text-sm font-bold text-slate-500">Your Guest(s)</p>
      {props.matches.map((m) => (
        <PersonItemBadge
          key={m.id}
          person={m.guest}
          description={m.guest.phone_number}
        />
      ))}
    </div>
  );
}

interface GuestMatchProps {
  match?: ProfilesRouterOutputs["getPersonProfile"]["guest_matches"][0];
}

function GuestMatch(props: GuestMatchProps) {
  if (!props.match)
    return (
      <p className="text-xs p-4 border rounded-lg mt-4 text-center">
        We have not selected a host for you yet.
      </p>
    );

  return (
    <div className="flex flex-col gap-2 mt-4">
      <p className="text-sm font-bold text-slate-500">Your Host</p>
      <PersonItemBadge
        person={props.match.host}
        description={props.match.host.phone_number}
        className="my-2"
      />
    </div>
  );
}
