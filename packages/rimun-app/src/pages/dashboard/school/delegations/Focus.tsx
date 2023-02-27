import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useParams } from "react-router-dom";
import CircularButton from "src/components/buttons/CircularButton";
import AssignDelegateToDelegationModalForm from "src/components/forms/delegations/AssignDelegateToDelegationModalForm";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Spinner from "src/components/status/Spinner";
import DelegationTitle from "src/components/text/DelegationTitle";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { DelegationsRouterOutputs, trpc } from "src/trpc";
import useAuthenticatedState from "src/utils/useAuthenticatedState";

export default function SchoolDelegationFocus() {
  const params = useParams();
  const delegationId = Number.parseInt(params.id!);

  const { data, isLoading } = trpc.delegations.getDelegation.useQuery(
    delegationId,
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const trpcCtx = trpc.useContext();

  const handleUpdate = () =>
    trpcCtx.delegations.getDelegation.invalidate(delegationId);

  if (isLoading || !data) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <DelegationTitle delegation={data} />

      <p className="my-4">
        Click on the plus icon to assign a delegate to different committees.
      </p>

      <Card className="divide-y">
        {data.delegation_committee_assignments
          .sort((a, b) => a.id - b.id)
          .map((dca) => {
            const application = data.person_applications.find(
              (a) => a.committee_id === dca.committee_id
            );
            return (
              <CommitteeItem
                key={dca.id}
                committee={dca.committee}
                delegation={data}
                delegateData={application}
                handleUpdate={handleUpdate}
              />
            );
          })}
      </Card>
    </div>
  );
}

interface CommitteeItemProps {
  committee: DelegationsRouterOutputs["getDelegation"]["delegation_committee_assignments"][0]["committee"];
  delegation: DelegationsRouterOutputs["getDelegation"];
  delegateData?: DelegationsRouterOutputs["getDelegation"]["person_applications"][0];
  handleUpdate: () => void;
}

function CommitteeItem(props: CommitteeItemProps) {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDelModal, setShowDelModal] = React.useState(false);

  const dispatch = useStateDispatch();
  const authState = useAuthenticatedState();

  const mutation = trpc.delegations.removeDelegate.useMutation({
    onSuccess: () => {
      props.handleUpdate();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Delegate was removed successfully.",
        })
      );
    },
  });

  return (
    <li className="flex p-4 justify-between items-center">
      <div>
        <p className="text-sm font-bold">{props.committee.name}</p>
        <p className="text-xs">{props.committee.forum.name}</p>
      </div>

      {!props.delegateData && (
        <CircularButton icon={PlusIcon} onClick={() => setShowAddModal(true)} />
      )}

      {!!props.delegateData && (
        <div className="flex gap-6 items-center">
          <PersonItemBadge
            person={props.delegateData.person}
            description={
              props.delegateData.is_ambassador ? "Ambassador" : "Delegate"
            }
          />
          <CircularButton
            icon={XMarkIcon}
            onClick={() => setShowDelModal(true)}
          />
        </div>
      )}

      <AssignDelegateToDelegationModalForm
        delegation={props.delegation}
        committee={props.committee}
        isVisible={showAddModal}
        setIsVisible={setShowAddModal}
        filters={{ application: { school_id: authState.account.school!.id } }}
        onAssigned={props.handleUpdate}
      />

      {!!props.delegateData && (
        <ConfirmationModal
          title="Remove Delegate"
          isVisible={showDelModal}
          setIsVisible={setShowDelModal}
          onConfirm={() =>
            mutation.mutate(props.delegateData?.person?.id ?? -1)
          }
        >
          Are you sure you want to remove{" "}
          <b>{props.delegateData.person.name}</b> from the committee?
        </ConfirmationModal>
      )}
    </li>
  );
}
