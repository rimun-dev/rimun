import React from "react";
import { Link } from "react-router-dom";
import Spinner from "src/components/status/Spinner";
import FullScreenPreview from "src/pages/landing/gallery/FullScreenPreview";
import Thumbnail from "src/pages/landing/gallery/Thumbnail";
import { trpc } from "src/trpc";
import { romanize } from "src/utils/strings";
import "./index.scss";

export default function LandingGallery() {
  const [selectedImageIdx, setSelectedImageIdx] = React.useState(-1);
  const [selectedAlbumIdx, setSelectedAlbumIdx] = React.useState(-1);

  const { data, isLoading } = trpc.resources.getImages.useQuery();

  if (!data || isLoading) return <Spinner />;

  const albums = data
    .filter((s) => s.gallery_images.length > 0)
    .sort((a, b) => b.edition_display - a.edition_display);

  return (
    <div id="gallery">
      <div className="hero">
        <div className="hero__overlay" />
        <div className="hero__title">Gallery</div>
        <div className="hero__description">
          Take a look at our pictures from RIMUN's previous editions.
        </div>
      </div>

      <div id="gallery" className="container">
        {albums.map((album, albumIdx) => (
          <div key={album.id} className="album">
            <div className="album__header">
              <h2>Edition {romanize(album.edition_display)}</h2>

              <Link
                to={`/gallery/albums/${album.id}`}
                className="album__header__link link"
              >
                View All
              </Link>
            </div>

            <div className="album__deck">
              {album.gallery_images.slice(0, 5).map((img, imageIdx) => (
                <Thumbnail
                  key={img.id}
                  imageData={img}
                  showFullScreen={() => {
                    setSelectedAlbumIdx(albumIdx);
                    setSelectedImageIdx(imageIdx);
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedImageIdx !== -1 && selectedAlbumIdx !== -1 && (
        <FullScreenPreview
          images={albums[selectedAlbumIdx].gallery_images}
          selectedImageIdx={selectedImageIdx}
          setSelectedImageIdx={setSelectedImageIdx}
        />
      )}
    </div>
  );
}
