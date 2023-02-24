import React from "react";
import AvatarCircle from "src/components/imgs/AvatarCircle";

interface PersonItemBadgeProps extends React.HTMLProps<HTMLDivElement> {
  person: {
    picture_path: string;
    full_name: string;
  };
  description?: string | null;
  format?: "small" | "base";
}

export default function PersonItemBadge(props: PersonItemBadgeProps) {
  return (
    <div className={`flex gap-4 items-center text-sm ${props.className}`}>
      <AvatarCircle
        path={props.person.picture_path}
        className={props.format === "small" ? "w-6 h-6" : undefined}
      />
      <div>
        <p className="font-bold">{props.person.full_name}</p>
        <p className="font-light text-xs">{props.description ?? ""}</p>
      </div>
    </div>
  );
}
