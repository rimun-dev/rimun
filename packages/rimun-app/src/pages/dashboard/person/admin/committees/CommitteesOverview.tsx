import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router-dom";
import CircularButton from "src/components/buttons/CircularButton";
import AddCommitteeModalForm from "src/components/forms/committees/AddCommitteeModalForm";
import EditCommitteeModalForm from "src/components/forms/committees/EditCommitteeModalForm";
import Card from "src/components/layout/Card";
import DropDown from "src/components/layout/DropDown";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { InfoRouterOutputs, trpc } from "src/trpc";
import { sortInCreationOrder } from "src/utils/collections";

export default function CommitteesOverview() {
  const { data, isLoading } = trpc.info.getForums.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const trpcCtx = trpc.useContext();
  const handleUpdate = () => trpcCtx.info.getForums.invalidate();

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <PageTitle>Forums</PageTitle>
      <div className="flex flex-col gap-4">
        {data.forums.map((f) => (
          <ForumItem
            key={f.id}
            forumData={f}
            stats={data.committees_stats}
            handleUpdate={handleUpdate}
          />
        ))}
      </div>
    </>
  );
}

interface ForumItemProps {
  forumData: InfoRouterOutputs["getForums"]["forums"][0];
  stats: InfoRouterOutputs["getForums"]["committees_stats"];
  handleUpdate: () => void;
}

function ForumItem(props: ForumItemProps) {
  const [showAddModal, setShowAddModal] = React.useState(false);

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <p className="text-lg font-bold">
          {props.forumData.name} ({props.forumData.acronym.toUpperCase()})
        </p>
        <button
          className="rounded-md flex items-center gap-2 bg-slate-200 hover:bg-slate-300 px-4 py-2"
          onClick={() => setShowAddModal(true)}
        >
          <span>Add Committee</span>
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
      <Card className="flex flex-col divide-y">
        {props.forumData.committees.sort(sortInCreationOrder).map((c) => (
          <CommitteeItem
            key={c.id}
            committeeData={c}
            nPersons={props.stats[c.id]}
            handleUpdate={props.handleUpdate}
          />
        ))}
      </Card>
      <AddCommitteeModalForm
        isVisible={showAddModal}
        setIsVisible={setShowAddModal}
        forumData={props.forumData}
        onCreated={props.handleUpdate}
      />
    </div>
  );
}

interface CommitteeItemProps {
  committeeData: InfoRouterOutputs["getForums"]["forums"][0]["committees"][0];
  nPersons: number;
  handleUpdate: () => void;
}

function CommitteeItem(props: CommitteeItemProps) {
  const [showEditModal, setShowEditModal] = React.useState(false);

  const navigate = useNavigate();

  return (
    <div className="p-4 grid grid-cols-5 items-center hover:bg-slate-50">
      <div
        className="col-span-2 hover:text-blue-500 cursor-pointer"
        onClick={() =>
          navigate(`/dashboard/admin/committees/${props.committeeData.id}`)
        }
      >
        {props.committeeData.name}
      </div>
      <div className="col-span-2 flex justify-center font-mono">
        {props.nPersons}/{props.committeeData.size}
      </div>
      <div className="col-span-1 flex justify-end">
        <DropDown
          items={[{ name: "Edit", onClick: () => setShowEditModal(true) }]}
        >
          <CircularButton icon={EllipsisHorizontalIcon} />
        </DropDown>
      </div>
      <EditCommitteeModalForm
        isVisible={showEditModal}
        setIsVisible={setShowEditModal}
        committeeData={props.committeeData}
        onUpdated={props.handleUpdate}
      />
    </div>
  );
}
