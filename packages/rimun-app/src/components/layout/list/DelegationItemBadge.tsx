import DelegationCircle from "src/components/imgs/DelegationCircle";
import { CommitteesRouterOutputs, DelegationsRouterOutputs } from "src/trpc";
import { renderDelegationName } from "src/utils/strings";

interface DelegationItemBadgeProps extends React.HTMLProps<HTMLDivElement> {
  delegation:
    | DelegationsRouterOutputs["getDelegations"][0]
    | CommitteesRouterOutputs["getCommittee"]["person_applications"][0]["delegation"]
    | DelegationsRouterOutputs["getDelegation"];
}

export default function DelegationItemBadge(props: DelegationItemBadgeProps) {
  return (
    <div {...props} className={`flex items-center gap-4 ${props.className}`}>
      <DelegationCircle delegation={props.delegation!} />
      <p className="font-bold">{renderDelegationName(props.delegation)}</p>
    </div>
  );
}
