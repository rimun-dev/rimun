import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import CTAButton from "src/components/buttons/CTAButton";
import AddTeamMemberModalForm from "src/components/forms/team/AddTeamMemberModalForm";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { SearchRouterOutputs, trpc } from "src/trpc";
import useRolesInformation from "src/utils/useRolesInformation";

export default function AdminTeam() {
  const [showModal, setShowModal] = React.useState(false);

  const rolesInfo = useRolesInformation();

  const { data, isLoading } = trpc.search.searchPersons.useQuery(
    {
      limit: Number.MAX_SAFE_INTEGER,
      filters: {
        status_application: "ACCEPTED",
        confirmed_group_id: rolesInfo.isLoading
          ? undefined
          : rolesInfo.getGroupIdByName("secretariat"),
      },
    },
    { refetchOnWindowFocus: true, enabled: !rolesInfo.isLoading }
  );

  const trpcCtx = trpc.useContext();

  if (isLoading || rolesInfo.isLoading || !data) return <Spinner />;

  const handleUpdate = () =>
    trpcCtx.search.searchPersons.invalidate({
      limit: Number.MAX_SAFE_INTEGER,
      filters: {
        status_application: "ACCEPTED",
        confirmed_group_id: rolesInfo.getGroupIdByName("secretariat"),
      },
    });

  return (
    <>
      <PageTitle>Secretariat Members</PageTitle>

      <CTAButton icon="plus" onClick={() => setShowModal(true)}>
        Add Team Member
      </CTAButton>

      <Card className="p-4 my-4">
        {data.result.map((pa) => (
          <TeamMemberItem
            key={pa.id}
            personApplicationData={pa}
            handleUpdate={handleUpdate}
          />
        ))}
        {data.result.length === 0 && (
          <p className="text-sm text-center">
            No Team Members were selected yet.
          </p>
        )}
      </Card>

      <AddTeamMemberModalForm
        isVisible={showModal}
        setIsVisible={setShowModal}
        onMemberAdded={handleUpdate}
      />
    </>
  );
}

interface TeamMemberItemProps {
  personApplicationData: SearchRouterOutputs["searchPersons"]["result"][0];
  handleUpdate: () => void;
}

function TeamMemberItem(props: TeamMemberItemProps) {
  const [showModal, setShowModal] = React.useState(false);

  const mutation = trpc.team.removeTeamMember.useMutation({
    onSuccess: props.handleUpdate,
  });

  return (
    <div className="border border-slate-100 rounded-sm p-4 w-full flex justify-between items-center">
      <PersonItemBadge
        person={props.personApplicationData.person}
        description={props.personApplicationData.confirmed_role?.name}
      />

      <CircularButton icon="x" onClick={() => setShowModal(true)} />

      <ConfirmationModal
        isVisible={showModal}
        setIsVisible={setShowModal}
        title="Remove Team Member"
        onConfirm={() => mutation.mutate(props.personApplicationData.person.id)}
      >
        Are you sure you want to remove{" "}
        <b>{props.personApplicationData.person.full_name}</b> from the team?
      </ConfirmationModal>
    </div>
  );
}
