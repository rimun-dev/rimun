import AvatarCircle from "src/components/imgs/AvatarCircle";
import Spinner from "src/components/status/Spinner";
import { InfoRouterOutputs, trpc } from "src/trpc";
import "./index.scss";

export default function LandingConferenceTeam() {
  const { data, isLoading } = trpc.info.getTeam.useQuery();

  if (!data || isLoading) return <Spinner />;

  return (
    <div id="team">
      <div className="hero">
        <div className="hero__overlay" />
        <div className="hero__title">Meet our team!</div>
      </div>
      <div className="container">
        <div id="team-list">
          {data.map((pa) => (
            <TeamMemberItem key={pa.id} personApplicationData={pa} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TeamMemberItemProps {
  personApplicationData: InfoRouterOutputs["getTeam"][0];
}

function TeamMemberItem(props: TeamMemberItemProps) {
  return (
    <div className="team-member">
      <AvatarCircle
        path={props.personApplicationData.person.picture_path}
        className="w-36 h-36"
      />
      <h3 className="team-member__name font-bold text-lg">
        {props.personApplicationData.person.full_name}
      </h3>
      <p className="team-member__role">
        {props.personApplicationData.confirmed_role?.name}
      </p>
      <p className="team-member__email">
        <a href={`mailto:${props.personApplicationData.person.account?.email}`}>
          {props.personApplicationData.person.account?.email}
        </a>
      </p>
    </div>
  );
}
