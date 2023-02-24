import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import EditProfilePictureModalForm from "src/components/forms/settings/EditProfilePictureModalForm";
import AvatarCircle from "src/components/imgs/AvatarCircle";
import { ProfilesRouterOutputs } from "src/trpc";

interface ProfilePictureProps {
  personData: ProfilesRouterOutputs["getCurrentPersonUser"];
}

export default function ProfilePicture(props: ProfilePictureProps) {
  const [showModal, setShowModal] = React.useState(false);
  const [picturePath, setPicturePath] = React.useState(
    props.personData.picture_path
  );

  return (
    <div className="flex justify-center">
      <div className="relative p-4 mt-4">
        <AvatarCircle className="w-32 h-32" path={picturePath} />
        <CircularButton
          icon="pencil"
          className="absolute left-2 bottom-2 shadow-md border border-slate-300"
          onClick={() => setShowModal(true)}
        />
      </div>

      <EditProfilePictureModalForm
        person={props.personData}
        isVisible={showModal}
        setIsVisible={setShowModal}
        onUpdated={(p) => setPicturePath(p)}
      />
    </div>
  );
}
