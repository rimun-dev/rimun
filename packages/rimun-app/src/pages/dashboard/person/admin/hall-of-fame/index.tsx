import {
  DocumentTextIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import CTAButton from "src/components/buttons/CTAButton";
import CreateTimelineEventModalForm from "src/components/forms/hall-of-fame/CreateTimelineEventModalForm";
import EditTimelineEventModalForm from "src/components/forms/hall-of-fame/EditTimelineEventModalForm";
import BaseRemoteImage from "src/components/imgs/BaseRemoteImage";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { TimelineRouterOutputs, trpc } from "src/trpc";
import { downloadDocument } from "src/utils/download";

export default function AdminHallOfFame() {
  const [showAddModal, setShowAddModal] = React.useState(false);

  const { data, isLoading } = trpc.timeline.getEvents.useQuery();

  if (!data || isLoading) return <Spinner />;

  return (
    <>
      <PageTitle>Hall of Fame (Timeline)</PageTitle>

      <CTAButton icon={PlusIcon} onClick={() => setShowAddModal(true)}>
        Create Event
      </CTAButton>

      <div className="grid gap-4 my-4 sm:grid-cols-2 md:grid-cols-3">
        {data
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .map((event) => (
            <TimelineEventCard key={event.id} eventData={event} />
          ))}
      </div>

      <CreateTimelineEventModalForm
        isVisible={showAddModal}
        setIsVisible={setShowAddModal}
      />
    </>
  );
}

interface TimelineEventCardProps {
  eventData: TimelineRouterOutputs["getEvents"][0];
}

function TimelineEventCard(props: TimelineEventCardProps) {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDelModal, setShowDelModal] = React.useState(false);

  const dispatch = useStateDispatch();
  const trpcCtx = trpc.useContext();

  const mutation = trpc.timeline.deleteEvent.useMutation({
    onSuccess: () => {
      trpcCtx.timeline.getEvents.invalidate();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Event successfully removed.",
        })
      );
    },
  });

  return (
    <Card className="rounded-lg overflow-hidden relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <CircularButton
          icon={PencilIcon}
          onClick={() => setShowEditModal(true)}
        />
        <CircularButton
          icon={TrashIcon}
          onClick={() => setShowDelModal(true)}
        />
      </div>
      <div className="h-40 w-full bg-slate-50 over overflow-hidden">
        <BaseRemoteImage
          path={props.eventData.picture_path ?? ""}
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold">{props.eventData.name}</h3>
        <p className="text-xs">
          {new Date(props.eventData.date).toLocaleDateString("it-IT")}
        </p>
        <p className="text-sm text-ellipsis line-clamp-3">
          {props.eventData.description}
        </p>
        {!!props.eventData.document_path && (
          <div className="flex items-center">
            <DocumentTextIcon className="w-4 h-4 text-slate-300 mr-4" />
            <a
              className="hover:underline cursor-pointer"
              onClick={() =>
                downloadDocument(
                  props.eventData.document_path!,
                  props.eventData.name
                )
              }
            >
              Download Document
            </a>
          </div>
        )}
      </div>

      <EditTimelineEventModalForm
        isVisible={showEditModal}
        setIsVisible={setShowEditModal}
        eventData={props.eventData}
      />

      <ConfirmationModal
        isVisible={showDelModal}
        setIsVisible={setShowDelModal}
        onConfirm={() => mutation.mutate(props.eventData.id)}
        title="Remove Timeline Event"
      >
        Are you sure you want to remove this event?
      </ConfirmationModal>
    </Card>
  );
}
