import {
  DocumentArrowDownIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useParams } from "react-router-dom";
import CircularButton from "src/components/buttons/CircularButton";
import AddChairToCommitteeModalForm from "src/components/forms/committees/AddChairToCommitteeModalForm";
import AddReportModalForm from "src/components/forms/committees/AddReportModalForm";
import AddTopicToCommitteeModalForm from "src/components/forms/committees/AddTopicToCommitteeModalForm";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import DelegationItemBadge from "src/components/layout/list/DelegationItemBadge";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { CommitteesRouterOutputs, trpc } from "src/trpc";
import { downloadDocument } from "src/utils/download";

interface CommitteeFocusViewProps {
  committeeData: CommitteesRouterOutputs["getCommittee"];
  handleUpdate: () => void;
}

export default function CommitteeFocus() {
  const params = useParams();

  const { data, isLoading } = trpc.committees.getCommittee.useQuery(
    Number.parseInt(params.id!),
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );

  const trpcCtx = trpc.useContext();

  const handleUpdate = () =>
    trpcCtx.committees.getCommittee.invalidate(Number.parseInt(params.id!));

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <PageTitle>{data.name}</PageTitle>
      <p className="text-lg -mt-3 mb-4">{data.forum.name}</p>

      <div className="sm:grid grid-cols-5 gap-4">
        <ChairsView committeeData={data} handleUpdate={handleUpdate} />
        <div className="col-span-3 flex flex-col gap-4">
          <ReportView committeeData={data} handleUpdate={handleUpdate} />
          <TopicsView committeeData={data} handleUpdate={handleUpdate} />
        </div>
      </div>
      <DelegatesView committeeData={data} handleUpdate={handleUpdate} />
    </>
  );
}

function ChairsView(props: CommitteeFocusViewProps) {
  const [showAddModal, setShowAddModal] = React.useState(false);

  const applications = props.committeeData.person_applications.filter(
    (a) => a.confirmed_group?.name === "chair"
  );

  return (
    <Card className="col-span-2 p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Chairs</h3>
        <CircularButton
          icon={PencilIcon}
          onClick={() => setShowAddModal(true)}
        />
      </div>
      <div className="pt-4">
        {applications.map((a) => (
          <ChairItem
            key={a.id}
            personApplicationData={a}
            handleUpdate={props.handleUpdate}
          />
        ))}
      </div>
      <AddChairToCommitteeModalForm
        isVisible={showAddModal}
        setIsVisible={setShowAddModal}
        committee={props.committeeData}
        onCreated={props.handleUpdate}
      />
    </Card>
  );
}

interface ChairItemProps {
  personApplicationData: CommitteesRouterOutputs["getCommittee"]["person_applications"][0];
  handleUpdate: () => void;
}

function ChairItem(props: ChairItemProps) {
  const [showDelModal, setShowDelModal] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const dispatch = useStateDispatch();

  const mutation = trpc.applications.updatePersonApplication.useMutation({
    onSuccess: () => {
      props.handleUpdate();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Chair was removed.",
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
        person={props.personApplicationData.person}
        description={props.personApplicationData.confirmed_role?.name}
      />
      <CircularButton
        icon={TrashIcon}
        className={`${isHovered ? "absolute" : "hidden"} right-0 top-2`}
        onClick={() => setShowDelModal(true)}
      />
      <ConfirmationModal
        isVisible={showDelModal}
        setIsVisible={setShowDelModal}
        onConfirm={() =>
          mutation.mutate({
            person_id: props.personApplicationData.person.id,
            confirmed_role_id: null,
            committee_id: null,
          })
        }
        title="Remove Chair"
      >
        Are you sure you want to remove{" "}
        <b>{props.personApplicationData.person.full_name}</b>?
      </ConfirmationModal>
    </div>
  );
}

function ReportView(props: CommitteeFocusViewProps) {
  const [showAddModal, setShowAddModal] = React.useState(false);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Report</h3>
        <CircularButton
          icon={PencilIcon}
          onClick={() => setShowAddModal(true)}
        />
      </div>

      {!!props.committeeData.report ? (
        <div className="flex items-center text-blue-500 hover:underline cursor-pointer gap-2">
          <DocumentArrowDownIcon className="w-6 h-6" />
          <a
            onClick={() =>
              downloadDocument(
                props.committeeData.report!.document_path,
                props.committeeData.report!.name
              )
            }
          >
            {props.committeeData.report!.name}
          </a>
        </div>
      ) : (
        <p className="text-slate-500 text-sm mt-2">No report uploaded yet.</p>
      )}

      <AddReportModalForm
        isVisible={showAddModal}
        setIsVisible={setShowAddModal}
        committee={props.committeeData}
        onUpdated={props.handleUpdate}
      />
    </Card>
  );
}

function TopicsView(props: CommitteeFocusViewProps) {
  const [showAddModal, setShowAddModal] = React.useState(false);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Topics</h3>
        <CircularButton icon={PlusIcon} onClick={() => setShowAddModal(true)} />
      </div>
      {props.committeeData.topics.length > 0 ? (
        <ul className="divide-y">
          {props.committeeData.topics.map((t) => (
            <TopicItem key={t.id} topic={t} onDeleted={props.handleUpdate} />
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 text-sm mt-2">No topics uploaded yet.</p>
      )}

      <AddTopicToCommitteeModalForm
        isVisible={showAddModal}
        setIsVisible={setShowAddModal}
        committee={props.committeeData}
        onCreated={props.handleUpdate}
      />
    </Card>
  );
}

interface TopicItemProps {
  topic: CommitteesRouterOutputs["getCommittee"]["topics"][0];
  onDeleted: () => void;
}

function TopicItem(props: TopicItemProps) {
  const [showDelModal, setShowDelModal] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const dispatch = useStateDispatch();

  const mutation = trpc.committees.deleteCommitteeTopic.useMutation({
    onSuccess: () => {
      props.onDeleted();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Topic was removed successfully.",
        })
      );
    },
  });

  return (
    <li
      className="text-sm italic py-2 flex items-center justify-between gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{props.topic.name}</span>
      <TrashIcon
        className={
          isHovered
            ? "block cursor-pointer flex-shrink-0 text-red-500 w-4 h-4"
            : "hidden"
        }
        onClick={() => setShowDelModal(true)}
      />
      <ConfirmationModal
        isVisible={showDelModal}
        setIsVisible={setShowDelModal}
        onConfirm={() => mutation.mutate(props.topic.id)}
        isLoading={mutation.isLoading}
        title="Remove Topic"
      >
        Are you sure you want to remove the topic <b>"{props.topic.name}"</b>?
      </ConfirmationModal>
    </li>
  );
}

function DelegatesView(props: CommitteeFocusViewProps) {
  const applications = props.committeeData.person_applications.filter(
    (a) => a.confirmed_group?.name === "delegate"
  );

  return (
    <Card className="p-4 mt-4">
      <h3 className="font-bold">Delegates</h3>
      <div className="divide-y">
        {applications.length === 0 && (
          <p className="text-slate-500 text-sm mt-2">
            No delegates assigned yet.
          </p>
        )}
        {applications.map((a) => (
          <DelegateItem key={a.id} personApplicationData={a} />
        ))}
      </div>
    </Card>
  );
}

interface DelegateItemProps {
  personApplicationData: CommitteesRouterOutputs["getCommittee"]["person_applications"][0];
}

function DelegateItem(props: DelegateItemProps) {
  if (!props.personApplicationData.delegation) return null;
  return (
    <div className="items-center py-2 grid grid-cols-2">
      <PersonItemBadge
        className="col-span-1"
        person={props.personApplicationData.person}
        description={
          props.personApplicationData.is_ambassador ? "Ambassador" : "Delegate"
        }
      />
      <DelegationItemBadge
        delegation={props.personApplicationData.delegation!}
        className="col-span-1"
      />
    </div>
  );
}
