import React from "react";
import { CDN_ENDPOINT } from "src/config";

export default function BaseRemoteImage({
  path,
  crossOrigin,
  placeholderElement,
  ...props
}: React.HTMLProps<HTMLImageElement> & {
  path?: string;
  placeholderElement?: () => JSX.Element;
}) {
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const imgRef = React.useRef<HTMLImageElement>(null);

  if (!path) return null;

  const Placeholder = placeholderElement ?? (() => <></>);
  if (isError) return <Placeholder />;

  const isLoaded = imgRef.current?.complete || !isLoading;

  return (
    <>
      <img
        {...props}
        ref={imgRef}
        src={`${CDN_ENDPOINT}/${path}`}
        loading="lazy"
        onError={() => setIsError(true)}
        onLoad={() => setIsLoading(false)}
        className={isLoaded ? props.className : "opacity-0 absolute"}
      />
      <div
        className={
          isLoaded ? "hidden" : "w-full h-full bg-slate-500 animate-pulse"
        }
      />
    </>
  );
}
