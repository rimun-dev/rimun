import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import BaseRemoteImage from "src/components/imgs/BaseRemoteImage";
import { ResourcesRouterOutputs } from "src/trpc";

type GalleryImage = ResourcesRouterOutputs["getImages"][0]["gallery_images"][0];

interface FullScreenPreviewProps {
  images: GalleryImage[];
  selectedImageIdx: number;
  setSelectedImageIdx: (idx: number) => void;
}

export default function FullScreenPreview(props: FullScreenPreviewProps) {
  return (
    <div id="view">
      <div id="view-overlay" />

      <div id="view-close" onClick={() => props.setSelectedImageIdx(-1)}>
        <XMarkIcon className="w-4 h-4" />
      </div>

      {props.selectedImageIdx > 0 && (
        <div
          id="view-left"
          onClick={() => props.setSelectedImageIdx(props.selectedImageIdx - 1)}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </div>
      )}

      {props.selectedImageIdx < props.images.length - 1 && (
        <div
          id="view-right"
          onClick={() => props.setSelectedImageIdx(props.selectedImageIdx + 1)}
        >
          <ChevronRightIcon className="w-4 h-4" />
        </div>
      )}

      <div id="view-main">
        <BaseRemoteImage
          id="view-image"
          path={props.images[props.selectedImageIdx].full_image_path}
        />
      </div>
    </div>
  );
}
