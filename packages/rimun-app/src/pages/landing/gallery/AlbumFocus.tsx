import React from "react";
import { useParams } from "react-router-dom";
import Spinner from "src/components/status/Spinner";
import FullScreenPreview from "src/pages/landing/gallery/FullScreenPreview";
import Thumbnail from "src/pages/landing/gallery/Thumbnail";
import { trpc } from "src/trpc";
import { romanize } from "src/utils/strings";

export default function AlbumFocus() {
  const [selectedImageIdx, setSelectedImageIdx] = React.useState(-1);

  const params = useParams();

  const { data, isLoading } = trpc.resources.getImages.useQuery();

  if (!data || isLoading) return <Spinner />;

  if (!params.edition) return null;

  const album = data.find(
    (s) => s.edition_display === Number.parseInt(params.edition ?? "0")
  );

  if (!album) return null;

  return (
    <div id="gallery">
      <div id="main">
        <div id="album" className="container">
          <h1 className="title">Edition {romanize(album?.edition_display)}</h1>

          <div className="album-grid">
            {album.gallery_images.map((img, idx) => (
              <Thumbnail
                key={img.id}
                imageData={img}
                showFullScreen={() => setSelectedImageIdx(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedImageIdx !== -1 && (
        <FullScreenPreview
          images={album.gallery_images}
          selectedImageIdx={selectedImageIdx}
          setSelectedImageIdx={setSelectedImageIdx}
        />
      )}
    </div>
  );
}
