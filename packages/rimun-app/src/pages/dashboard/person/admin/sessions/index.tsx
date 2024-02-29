import { PencilIcon, PhotoIcon, PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useNavigate } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import CircularButton from "src/components/buttons/CircularButton";
import CTAButton from "src/components/buttons/CTAButton";
import CreateSessionModalForm from "src/components/forms/sessions/CreateSessionModalForm";
import UpdateSessionImageModalForm from "src/components/forms/sessions/UpdateSessionImageModalForm";
import UpdateSessionModalForm from "src/components/forms/sessions/UpdateSessionModalForm";
import BaseRemoteImage from "src/components/imgs/BaseRemoteImage";
import Card from "src/components/layout/Card";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { trpc, type RouterOutputs } from "src/trpc";

export default function AdminSessions() {
  const [showAddModal, setShowAddModal] = React.useState(false);

  const navigate = useNavigate();

  const { data, isLoading } = trpc.sessions.getAllSessions.useQuery();

  if (!data || isLoading) return <Spinner />;

  return (
    <>
      <PageTitle>Sessions</PageTitle>

      <p className="mb-4">
        Here you can manage the different RIMUN editions and start new sessions.
      </p>

      <CTAButton
        icon={PlusIcon}
        onClick={() => navigate("/dashboard/admin/sessions/new")}
      >
        New Session
      </CTAButton>

      <div className="grid gap-4 my-4 sm:grid-cols-2 md:grid-cols-3">
        {data
          .sort((a, b) => a.edition_display - b.edition_display)
          .map((event) => (
            <SessionsCard key={event.id} sessionData={event} />
          ))}
      </div>

      <CreateSessionModalForm
        isVisible={showAddModal}
        setIsVisible={setShowAddModal}
        nextEdition={Math.max(...data.map((s) => s.edition_display ?? 0)) + 1}
      />
    </>
  );
}

interface SessionsCardProps {
  sessionData: RouterOutputs["sessions"]["getAllSessions"][0];
}

function SessionsCard(props: SessionsCardProps) {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showEditPicModal, setShowEditPicModal] = React.useState(false);

  return (
    <Card className={`rounded-lg overflow-hidden relative`}>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <CircularButton
          icon={PhotoIcon}
          onClick={() => setShowEditPicModal(true)}
        />
        <CircularButton
          icon={PencilIcon}
          onClick={() => setShowEditModal(true)}
        />
      </div>
      <div className="absolute top-4 left-4 h-10 w-10 flex justify-center items-center font-mono rounded-full bg-brand text-white">
        {props.sessionData.edition_display}
      </div>
      <div className="h-40 w-full bg-slate-50 over overflow-hidden">
        <BaseRemoteImage
          path={props.sessionData.image_path ?? ""}
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold">{props.sessionData.title}</h3>
        {!!props.sessionData.date_start && !!props.sessionData.date_end && (
          <p className="text-xs">
            {new Date(props.sessionData.date_start).toLocaleDateString()}-
            {new Date(props.sessionData.date_end).toLocaleDateString()}
          </p>
        )}
        <p className="text-sm text-ellipsis line-clamp-3">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {props.sessionData.description ?? ""}
          </ReactMarkdown>
        </p>
      </div>

      <UpdateSessionModalForm
        isVisible={showEditModal}
        setIsVisible={setShowEditModal}
        sessionData={props.sessionData}
      />

      <UpdateSessionImageModalForm
        isVisible={showEditPicModal}
        setIsVisible={setShowEditPicModal}
        sessionData={props.sessionData}
      />
    </Card>
  );
}
