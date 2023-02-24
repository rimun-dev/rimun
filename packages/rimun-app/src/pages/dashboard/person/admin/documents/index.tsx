import { DocumentTextIcon } from "@heroicons/react/24/outline";
import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import CTAButton from "src/components/buttons/CTAButton";
import UploadDocumentModalForm from "src/components/forms/resources/UploadDocumentModalForm";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { ResourcesRouterOutputs, trpc } from "src/trpc";
import useDownload from "src/utils/useDownload";

export default function AdminDocuments() {
  const [showModal, setShowModal] = React.useState(false);

  const { data, isLoading } = trpc.resources.getDocuments.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  const trpcCtx = trpc.useContext();

  const handleUpdate = () => trpcCtx.resources.getDocuments.invalidate();

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <PageTitle>Public Resources</PageTitle>

      <CTAButton icon="plus" onClick={() => setShowModal(true)}>
        Upload Document
      </CTAButton>

      <Card className="flex flex-col mt-4 p-4 gap-1">
        {data.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
            handleUpdate={handleUpdate}
          />
        ))}
      </Card>

      <UploadDocumentModalForm
        isVisible={showModal}
        setIsVisible={setShowModal}
        onDocumentUploaded={handleUpdate}
      />
    </>
  );
}

interface DocumentItemProps {
  document: ResourcesRouterOutputs["getDocuments"][0];
  handleUpdate: () => void;
}

function DocumentItem(props: DocumentItemProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const download = useDownload();

  const mutation = trpc.resources.deleteDocument.useMutation({
    onSuccess: props.handleUpdate,
  });

  return (
    <div
      className="p-4 border border-slate-200 rounded-sm flex justify-between items-center"
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <div className="flex items-center">
        <DocumentTextIcon className="w-9 h-9 text-slate-300 mr-4" />
        <a
          className="hover:underline cursor-pointer"
          onClick={() => download(props.document.path, props.document.name)}
        >
          {props.document.name}
        </a>
      </div>

      {isFocused && (
        <CircularButton icon="x" onClick={() => setShowModal(true)} />
      )}

      <ConfirmationModal
        isVisible={showModal}
        setIsVisible={setShowModal}
        title="Delete Document"
        onConfirm={() => mutation.mutate(props.document.id)}
      >
        Are you sure you want to delete the document{" "}
        <b>{props.document.name}</b>?
      </ConfirmationModal>
    </div>
  );
}
