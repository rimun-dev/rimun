import { UserIcon } from "@heroicons/react/24/outline";
import React from "react";
import BaseCircle from "src/components/imgs/BaseCircle";
import BaseRemoteImage from "src/components/imgs/BaseRemoteImage";

interface AvatarCircleProps extends React.HTMLProps<HTMLDivElement> {
  path?: string;
}

export default function AvatarCircle(props: AvatarCircleProps) {
  const [isError, setIsError] = React.useState(false);
  return (
    <BaseCircle {...props}>
      <UserIcon className="w-6 h-6 text-slate-400" />
      <BaseRemoteImage
        path={props.path}
        onError={() => setIsError(true)}
        onLoad={() => setIsError(false)}
        className={`absolute w-full h-full ${
          isError ? "hidden" : undefined
        } object-cover`}
      />
    </BaseCircle>
  );
}
