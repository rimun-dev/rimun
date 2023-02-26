import SubmitButton from "src/components/buttons/SubmitButton";
import CancelButton from "src/components/fields/base/CancelButton";
import Modal, { ModalHeader, ModalProps } from "src/components/layout/Modal";
import { ResourcesRouterOutputs, trpc } from "src/trpc";

interface RemoveGalleryImageModalFormProps extends ModalProps {
  image: ResourcesRouterOutputs["getImages"][0]["gallery_images"][0];
  onImageDeleted: () => void;
}

export default function RemoveGalleryImageModalForm(
  props: RemoveGalleryImageModalFormProps
) {
  const mutation = trpc.resources.deleteGalleryImage.useMutation({
    onSuccess: () => {
      props.onImageDeleted();
      props.setIsVisible(false);
    },
  });

  return (
    <Modal
      {...props}
      className="w-full top-8 max-w-sm bg-white shadow-xl rounded-lg"
    >
      <ModalHeader onDismiss={() => props.setIsVisible(false)}>
        Remove Gallery Image
      </ModalHeader>
      <p className="px-4 text-sm">
        Are you sure you want to remove the image from the gallery?
      </p>

      <div className="flex mt-6 justify-between p-4">
        <CancelButton
          onClick={() => props.setIsVisible(false)}
          className="flex justify-center items-center flex-1 mr-2"
        >
          Cancel
        </CancelButton>

        <SubmitButton
          isLoading={mutation.isLoading}
          onClick={() => mutation.mutate(props.image.id)}
          className="ml-2 bg-red-500 flex-1"
        >
          Remove Image
        </SubmitButton>
      </div>
    </Modal>
  );
}
