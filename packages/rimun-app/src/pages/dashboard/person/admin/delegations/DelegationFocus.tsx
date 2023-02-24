import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useParams } from "react-router-dom";
import CircularButton from "src/components/buttons/CircularButton";
import AssignCommitteeToDelegationModalForm from "src/components/forms/delegations/AssignCommitteeToDelegationModalForm";
import AssignDelegateToDelegationModalForm from "src/components/forms/delegations/AssignDelegateToDelegationModalForm";
import AssignSchoolToDelegationModalForm from "src/components/forms/delegations/AssignSchoolToDelegationModalForm";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import SchoolItemBadge from "src/components/layout/list/utils/SchoolItemBadge";
import Spinner from "src/components/status/Spinner";
import DelegationTitle from "src/components/text/DelegationTitle";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { DelegationsRouterOutputs, trpc } from "src/trpc";

interface DelegationFocusViewProps {
  delegationData: DelegationsRouterOutputs["getDelegation"];
  handleUpdate: () => void;
}

export default function DelegationFocus() {
  const params = useParams();

  const { data, isLoading } = trpc.delegations.getDelegation.useQuery(
    Number.parseInt(params.id!),
    {
      enabled: !!params.id,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const trpcCtx = trpc.useContext();

  const handleUpdate = () =>
    trpcCtx.delegations.getDelegation.invalidate(Number.parseInt(params.id!));

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <DelegationTitle delegation={data} />
      <div className="grid grid-cols-5 mt-6 gap-4">
        {!data.is_individual && (
          <SchoolView delegationData={data} handleUpdate={handleUpdate} />
        )}
        <CommitteesView delegationData={data} handleUpdate={handleUpdate} />
      </div>
      <DelegatesView delegationData={data} handleUpdate={handleUpdate} />
    </>
  );
}

function SchoolView(props: DelegationFocusViewProps) {
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [showRemoveModal, setShowRemoveModal] = React.useState(false);

  const dispatch = useStateDispatch();

  const mutation = trpc.delegations.removeSchool.useMutation({
    onSuccess: () => {
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "School was removed from the delegation successfully.",
        })
      );
    },
  });

  return (
    <Card className="p-4  col-span-2">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">School</h3>
        <CircularButton
          icon="pencil"
          onClick={() => setShowAssignModal(true)}
        />
      </div>
      {!!props.delegationData.school ? (
        <SchoolItemBadge school={props.delegationData.school} />
      ) : (
        <p className="mt-4">
          This delegation has not been assigned to a school yet.
        </p>
      )}

      <AssignSchoolToDelegationModalForm
        isVisible={showAssignModal}
        setIsVisible={setShowAssignModal}
        delegationData={props.delegationData}
        onAssigned={props.handleUpdate}
      />

      <ConfirmationModal
        isVisible={showRemoveModal}
        setIsVisible={setShowRemoveModal}
        title="Remove Assigned School"
        onConfirm={() => mutation.mutate(props.delegationData.id)}
      >
        Are you sure you want to remove this school from the delegation?
      </ConfirmationModal>
    </Card>
  );
}

function CommitteesView(props: DelegationFocusViewProps) {
  const [showAssignModal, setShowAssignModal] = React.useState(false);

  return (
    <Card className="p-4 col-span-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">
          Committees (
          <span className="font-mono text-slate-400">
            {props.delegationData.delegation_committee_assignments.length}/
            {props.delegationData.n_delegates}
          </span>
          )
        </h3>
        <CircularButton icon="plus" onClick={() => setShowAssignModal(true)} />
      </div>

      <ul className="divide-y">
        {props.delegationData.delegation_committee_assignments.map((dca) => (
          <CommitteeItem
            key={dca.id}
            delegation={props.delegationData}
            committee={dca.committee}
            handleUpdate={props.handleUpdate}
          />
        ))}
      </ul>

      {props.delegationData.delegation_committee_assignments.length === 0 && (
        <p className="mt-4">
          This delegation has not been assigned to any committee yet.
        </p>
      )}

      <AssignCommitteeToDelegationModalForm
        isVisible={showAssignModal}
        setIsVisible={setShowAssignModal}
        delegationData={props.delegationData}
        onAssigned={props.handleUpdate}
      />
    </Card>
  );
}

interface CommitteeItemProps {
  committee: DelegationsRouterOutputs["getDelegation"]["delegation_committee_assignments"][0]["committee"];
  delegation: DelegationsRouterOutputs["getDelegation"];
  handleUpdate: () => void;
}

function CommitteeItem(props: CommitteeItemProps) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const dispatch = useStateDispatch();

  const mutation = trpc.delegations.removeCommittee.useMutation({
    onSuccess: () => {
      props.handleUpdate();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Delegation was removed from committee successfully.",
        })
      );
    },
  });

  return (
    <li
      className="py-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="text-sm font-bold">{props.committee.name}</p>
      <p className="text-xs">{props.committee.forum.name}</p>
      {isHovered && (
        <TrashIcon
          className="absolute cursor-pointer right-0 top-4 text-red-500 w-6 h-6"
          onClick={() => setShowDeleteModal(true)}
        />
      )}

      <ConfirmationModal
        isVisible={showDeleteModal}
        setIsVisible={setShowDeleteModal}
        title="Remove Committee"
        onConfirm={() =>
          mutation.mutate({
            committee_id: props.committee.id,
            delegation_id: props.delegation.id,
          })
        }
      >
        Are your sure you want to remove the delegation from committee{" "}
        <b>{props.committee.name}</b>?
      </ConfirmationModal>
    </li>
  );
}

function DelegatesView(props: DelegationFocusViewProps) {
  const [showAssignModal, setShowAssignModal] = React.useState(false);

  return (
    <Card className="mt-4 p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">
          Delegates (
          <span className="font-mono text-slate-400">
            {props.delegationData.person_applications.length}/
            {props.delegationData.delegation_committee_assignments.length}~
            {props.delegationData.n_delegates}
          </span>
          ) (delegates/assigned committees~max delegates)
        </h3>
        <CircularButton icon="plus" onClick={() => setShowAssignModal(true)} />
      </div>

      <ul className="divide-y mt-4">
        {props.delegationData.person_applications.map((pa) => (
          <DelegateItem
            key={pa.id}
            delegateApplicationData={pa}
            handleUpdate={props.handleUpdate}
          />
        ))}
      </ul>

      {props.delegationData.person_applications.length === 0 && (
        <p className="mt-4">This delegation has no delegates yet.</p>
      )}

      <AssignDelegateToDelegationModalForm
        isVisible={showAssignModal}
        setIsVisible={setShowAssignModal}
        delegation={props.delegationData}
        onAssigned={props.handleUpdate}
      />
    </Card>
  );
}

interface DelegateItemProps {
  delegateApplicationData: DelegationsRouterOutputs["getDelegation"]["person_applications"][0];
  handleUpdate: () => void;
}

function DelegateItem(props: DelegateItemProps) {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const dispatch = useStateDispatch();

  const mutation = trpc.delegations.removeDelegate.useMutation({
    onSuccess: () => {
      props.handleUpdate();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Delegate was removed from delegation successfully.",
        })
      );
    },
  });

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <PersonItemBadge
        person={props.delegateApplicationData.person}
        description={
          props.delegateApplicationData.is_ambassador
            ? "Ambassador"
            : "Delegate"
        }
      />

      {isHovered && (
        <TrashIcon
          className="absolute cursor-pointer right-0 top-4 text-red-500 w-6 h-6"
          onClick={() => setShowDeleteModal(true)}
        />
      )}

      <ConfirmationModal
        isVisible={showDeleteModal}
        setIsVisible={setShowDeleteModal}
        title="Remove Delegate"
        onConfirm={() =>
          mutation.mutate(props.delegateApplicationData.person.id)
        }
      >
        Are your sure you want to remove the delegate from the delegation?
      </ConfirmationModal>
    </div>
  );
}
