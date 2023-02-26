import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router-dom";
import CircularButton from "src/components/buttons/CircularButton";
import CTAButton from "src/components/buttons/CTAButton";
import AddDelegationModalForm from "src/components/forms/delegations/AddDelegationModalForm";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import DropDown from "src/components/layout/DropDown";
import DelegationItemBadge from "src/components/layout/list/DelegationItemBadge";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import TabsMenu from "src/components/navigation/TabsMenu";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { DelegationsRouterOutputs, trpc } from "src/trpc";

export default function DelegationsOverview() {
  const [showAddModal, setShowAddModal] = React.useState(false);

  const { data, isLoading } = trpc.delegations.getDelegations.useQuery(
    {},
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const trpcCtx = trpc.useContext();

  const handleUpdate = () => trpcCtx.delegations.getDelegations.invalidate();

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <PageTitle>Delegations</PageTitle>

      <CTAButton
        icon={PlusIcon}
        className="mb-4"
        onClick={() => setShowAddModal(true)}
      >
        Create Delegation
      </CTAButton>

      <TabsMenu
        options={[
          {
            name: "Schools",
            component: () => (
              <Card className="p-4 mt-4 overflow-y-hidden overflow-x-auto">
                <div style={{ minWidth: "628px" }}>
                  <div className="grid grid-cols-7 p-2 text-xs text-slate-500 font-bold">
                    <div className="col-span-3">Delegation</div>
                    <div className="col-span-2">School</div>
                    <div className="col-span-1"># Delegates</div>
                  </div>
                  <div className="divide-y">
                    {data
                      .filter((d) => !d.is_individual)
                      .map((d) => (
                        <SchoolDelegationItem
                          key={d.id}
                          delegationData={d}
                          handleUpdate={handleUpdate}
                        />
                      ))}
                  </div>
                </div>
              </Card>
            ),
          },
          {
            name: "Historical",
            component: () => (
              <Card className="p-4 mt-4 overflow-y-hidden overflow-x-auto">
                <div style={{ minWidth: "628px" }}>
                  <div className="grid grid-cols-7 p-2 text-xs text-slate-500 font-bold">
                    <div className="col-span-3">Delegation</div>
                    <div className="col-span-2">Ambassador</div>
                  </div>
                  <div className="divide-y">
                    {data
                      .filter((d) => d.is_individual)
                      .map((d) => (
                        <HSCDelegationItem
                          key={d.id}
                          delegationData={d}
                          handleUpdate={handleUpdate}
                        />
                      ))}
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
      />

      <AddDelegationModalForm
        isVisible={showAddModal}
        setIsVisible={setShowAddModal}
        onCreated={handleUpdate}
      />
    </>
  );
}

interface DelegationItemProps {
  delegationData: DelegationsRouterOutputs["getDelegations"][0];
  handleUpdate: () => void;
}

function SchoolDelegationItem(props: DelegationItemProps) {
  const [showDelModal, setShowDelModal] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useStateDispatch();

  const mutation = trpc.delegations.deleteDelegation.useMutation({
    onSuccess: () => {
      props.handleUpdate();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Delegation was deleted successfully.",
        })
      );
    },
  });

  return (
    <div className="grid grid-cols-7 w-full items-center p-4">
      <DelegationItemBadge
        delegation={props.delegationData}
        className="col-span-3"
      />

      <div className="flex items-center col-span-2 text-xs text-slate-500">
        {props.delegationData.school?.name ?? "-"}
      </div>

      <div className="flex items-center col-span-1 text-xs text-slate-500">
        {props.delegationData.person_applications.length}/
        {props.delegationData.n_delegates}
      </div>

      <div className="flex items-center gap-2 justify-end col-span-1">
        <DropDown
          items={[
            {
              name: "Manage",
              onClick: () =>
                navigate(
                  `/dashboard/admin/delegations/${props.delegationData.id}`
                ),
            },
            { name: "Delete", onClick: () => setShowDelModal(true) },
          ]}
        >
          <CircularButton icon={EllipsisHorizontalIcon} />
        </DropDown>
      </div>

      <ConfirmationModal
        isVisible={showDelModal}
        setIsVisible={setShowDelModal}
        title="Delete Delegation"
        onConfirm={() => mutation.mutate(props.delegationData.id)}
      >
        Are you sure you want to delete this delegation?
      </ConfirmationModal>
    </div>
  );
}

function HSCDelegationItem(props: DelegationItemProps) {
  const [showDelModal, setShowDelModal] = React.useState(false);

  const navigate = useNavigate();
  const dispatch = useStateDispatch();

  const mutation = trpc.delegations.deleteDelegation.useMutation({
    onSuccess: () => {
      props.handleUpdate();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Delegation was deleted successfully.",
        })
      );
    },
  });

  return (
    <div className="grid grid-cols-7 w-full items-center p-4">
      <DelegationItemBadge
        delegation={props.delegationData}
        className="col-span-3"
      />

      <div className="flex items-center col-span-2 text-xs text-slate-500">
        {props.delegationData.person_applications.length > 0 ? (
          <PersonItemBadge
            person={props.delegationData.person_applications[0].person}
          />
        ) : (
          "Not Assigned"
        )}
      </div>

      <div className="flex items-center gap-2 justify-end col-span-1">
        <DropDown
          items={[
            {
              name: "Manage",
              onClick: () =>
                navigate(
                  `/dashboard/admin/delegations/${props.delegationData.id}`
                ),
            },
            { name: "Delete", onClick: () => setShowDelModal(true) },
          ]}
        >
          <CircularButton icon={EllipsisHorizontalIcon} />
        </DropDown>
      </div>

      <ConfirmationModal
        isVisible={showDelModal}
        setIsVisible={setShowDelModal}
        title="Delete Delegation"
        onConfirm={() => mutation.mutate(props.delegationData.id)}
      >
        Are you sure you want to delete this delegation?
      </ConfirmationModal>
    </div>
  );
}
