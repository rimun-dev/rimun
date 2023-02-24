import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import CTAButton from "src/components/buttons/CTAButton";
import UploadGalleryImagesModalForm from "src/components/forms/resources/UploadGalleryImagesModalForm";
import BaseRemoteImage from "src/components/imgs/BaseRemoteImage";
import Card from "src/components/layout/Card";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { ResourcesRouterOutputs, trpc } from "src/trpc";

export default function AdminGallery() {
  const [showModal, setShowModal] = React.useState(false);

  const { data, isLoading } = trpc.resources.getImages.useQuery();

  const trpcCtx = trpc.useContext();

  const handleUpdate = () => trpcCtx.resources.getImages.invalidate();

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <PageTitle>Photo Gallery</PageTitle>

      <CTAButton icon="plus" onClick={() => setShowModal(true)}>
        Upload Images
      </CTAButton>

      <div className="flex flex-col gap-4 mt-4">
        {data.map((session) => (
          <SessionGalleryList
            key={session.id}
            sessionData={session}
            handleUpdate={handleUpdate}
          />
        ))}
      </div>

      <UploadGalleryImagesModalForm
        isVisible={showModal}
        setIsVisible={setShowModal}
        onImagesUploaded={handleUpdate}
      />
    </>
  );
}

interface SessionGalleryListProps {
  sessionData: ResourcesRouterOutputs["getImages"][0];
  handleUpdate: () => void;
}

function SessionGalleryList(props: SessionGalleryListProps) {
  const [showImages, setShowImages] = React.useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between p-4">
        <h2 className="font-bold">
          Session {props.sessionData.edition_display}: "
          {props.sessionData.title}"
        </h2>
        <CircularButton
          icon="chevron-down"
          className={`transition-transform ${
            showImages ? "rotate-180" : undefined
          }`}
          onClick={() => setShowImages(!showImages)}
        />
      </div>
      {showImages && (
        <div className="flex flex-wrap gap-4">
          {props.sessionData.gallery_images.map((img) => (
            <GalleryImageItem
              key={img.id}
              image={img}
              handleUpdate={props.handleUpdate}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

interface GalleryImageItemProps {
  image: ResourcesRouterOutputs["getImages"][0]["gallery_images"][0];
  handleUpdate: () => void;
}

function GalleryImageItem(props: GalleryImageItemProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showFull, setShowFull] = React.useState(false);

  const mutation = trpc.resources.deleteGalleryImage.useMutation({
    onSuccess: props.handleUpdate,
  });

  return (
    <>
      <div
        className="relative h-24 w-36 rounded-md overflow-hidden bg-slate-100"
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        <BaseRemoteImage
          path={props.image.thumbnail_path}
          className={`absolute w-full h-full object-cover`}
        />
        {isFocused && (
          <div className="absolute right-2 top-2 flex items-center">
            <CircularButton
              icon="arrows-pointing-out"
              onClick={() => setShowFull(true)}
            />
            <CircularButton
              icon="x"
              className="ml-2"
              onClick={() => setShowModal(true)}
            />
          </div>
        )}
      </div>

      <ConfirmationModal
        isVisible={showModal}
        setIsVisible={setShowModal}
        title="Delete Image"
        onConfirm={() => mutation.mutate(props.image.id)}
      >
        Are you sure you want to delete the iamge?
      </ConfirmationModal>

      <div
        className={`${
          showFull ? "fixed" : "hidden"
        } left-0 top-0 h-screen w-screen flex items-center justify-center z-50`}
      >
        <div
          className="absolute w-full h-full bg-slate-900 bg-opacity-75"
          onClick={() => setShowFull(false)}
        />
        <BaseRemoteImage
          path={props.image.full_image_path}
          className="max-w-4xl z-50"
        />
      </div>
    </>
  );
}
