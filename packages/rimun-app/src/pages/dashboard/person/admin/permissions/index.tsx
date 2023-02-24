import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import GivePermissionModalForm from "src/components/forms/team/GivePermissionModalForm";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { TeamRouterOutputs, trpc } from "src/trpc";

export default function AdminPermissions() {
  const { data, isLoading } = trpc.team.getAllPermissions.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  const trpcCtx = trpc.useContext();

  const handleUpdate = () => trpcCtx.team.getAllPermissions.invalidate();

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <PageTitle>Permissions</PageTitle>
      {data.map((resource) => (
        <ResourceList
          key={resource.id}
          resourceData={resource}
          handleUpdate={handleUpdate}
        />
      ))}
    </>
  );
}

interface ResourceListProps {
  resourceData: TeamRouterOutputs["getAllPermissions"][0];
  handleUpdate: () => void;
}

function ResourceList(props: ResourceListProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showList, setShowList] = React.useState(true);

  return (
    <Card
      className="mt-4 p-4 gap-1"
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <div className="flex justify-between items-center">
        <h2 className="uppercase font-bold text-sm">
          {props.resourceData.name}
        </h2>
        <div
          className={`flex items-center gap-2 ${
            isFocused
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <CircularButton icon="plus" onClick={() => setShowModal(true)} />
          <CircularButton
            icon="chevron-down"
            className={`transition-transform ${
              showList ? "rotate-180" : undefined
            }`}
            onClick={() => setShowList(!showList)}
          />
        </div>
      </div>
      {showList && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {props.resourceData.permissions.map((permission) => (
            <PermissionItem
              key={permission.id}
              permissionData={permission}
              handleUpdate={props.handleUpdate}
            />
          ))}
        </div>
      )}

      <GivePermissionModalForm
        resourceData={props.resourceData}
        isVisible={showModal}
        setIsVisible={setShowModal}
        onPermissionGiven={props.handleUpdate}
      />
    </Card>
  );
}

interface PermissionItemProps {
  permissionData: TeamRouterOutputs["getAllPermissions"][0]["permissions"][0];
  handleUpdate: () => void;
}

function PermissionItem(props: PermissionItemProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const mutation = trpc.team.revokePermission.useMutation({
    onSuccess: props.handleUpdate,
  });

  return (
    <div
      key={props.permissionData.person.id}
      className="border border-slate-200 p-2 rounded-lg flex justify-between items-center"
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <PersonItemBadge person={props.permissionData.person} />

      <div
        className={`flex items-center gap-2 ${
          isFocused
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <CircularButton icon="x" onClick={() => setShowModal(true)} />
      </div>

      <ConfirmationModal
        isVisible={showModal}
        setIsVisible={setShowModal}
        title="Remove Team Member"
        onConfirm={() =>
          mutation.mutate({
            person_id: props.permissionData.person.id,
            resource_id: props.permissionData.resource_id,
          })
        }
      >
        Are you sure you want to revoke{" "}
        <b>{props.permissionData.person.full_name}</b>'s permission on resource{" "}
        <b>{props.permissionData.resource.name}</b>?
      </ConfirmationModal>
    </div>
  );
}
