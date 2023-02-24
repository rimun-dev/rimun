import React from "react";
import { bucket } from "src/supabase";

export default function BaseRemoteImage({
  path,
  crossOrigin,
  ...props
}: React.HTMLProps<HTMLImageElement> & { path?: string }) {
  const [data, setData] = React.useState<string>();

  const downloadImage = async () => {
    if (!path) return;
    const result = await bucket.download(path);
    if (result.error) return;
    setData(URL.createObjectURL(result.data));
  };

  React.useEffect(() => {
    downloadImage();
  }, [path]);

  return <img {...props} src={data} loading="lazy" />;
}
