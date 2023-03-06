import { EyeIcon } from "@heroicons/react/24/outline";
import BaseRemoteImage from "src/components/imgs/BaseRemoteImage";
import { ResourcesRouterOutputs } from "src/trpc";

type GalleryImage = ResourcesRouterOutputs["getImages"][0]["gallery_images"][0];

interface ThumbnailProps {
  imageData: GalleryImage;
  showFullScreen: () => void;
}

export default function Thumbnail(props: ThumbnailProps) {
  return (
    <div className="thumbnail">
      <BaseRemoteImage
        className="thumbnail__pic"
        path={props.imageData.thumbnail_path}
      />

      <div className="thumbnail__overlay" onClick={props.showFullScreen}>
        <EyeIcon className="w-6 h-6" />
        View
      </div>
    </div>
  );
}
