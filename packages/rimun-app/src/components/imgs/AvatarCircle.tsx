import { UserIcon } from "@heroicons/react/24/outline";
import React from "react";
import BaseCircle from "src/components/imgs/BaseCircle";
import BaseRemoteImage from "src/components/imgs/BaseRemoteImage";

interface AvatarCircleProps extends React.HTMLProps<HTMLDivElement> {
  path?: string;
}

export default function AvatarCircle(props: AvatarCircleProps) {
  return (
    <BaseCircle {...props}>
      <BaseRemoteImage
        path={props.path}
        className={`absolute w-full h-full object-cover`}
        placeholderElement={() => (
          <UserIcon className="w-6 h-6 text-slate-400" />
        )}
      />
    </BaseCircle>
  );
}
