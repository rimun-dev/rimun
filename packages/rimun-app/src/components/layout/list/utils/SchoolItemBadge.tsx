import React from "react";
import FlagCircle from "src/components/imgs/FlagCircle";
import { DelegationsRouterOutputs, SearchRouterOutputs } from "src/trpc";

interface SchoolItemBadgeProps extends React.HTMLProps<HTMLDivElement> {
  school:
    | SearchRouterOutputs["searchSchools"]["result"][0]["school"]
    | NonNullable<DelegationsRouterOutputs["getDelegation"]["school"]>;
}

export default function SchoolItemBadge(props: SchoolItemBadgeProps) {
  return (
    <div className={`flex gap-4 items-center text-sm ${props.className}`}>
      <FlagCircle country={props.school.country} />
      <div>
        <p className="font-bold">{props.school.name}</p>
        <p className="font-light text-xs">
          {props.school.city}, {props.school.country.name}
        </p>
      </div>
    </div>
  );
}
