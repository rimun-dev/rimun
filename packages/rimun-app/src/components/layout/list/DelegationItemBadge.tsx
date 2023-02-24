import DelegationCircle from "src/components/imgs/DelegationCircle";
import Spinner from "src/components/status/Spinner";
import { CommitteesRouterOutputs, DelegationsRouterOutputs } from "src/trpc";
import { useDelegationName } from "src/utils/strings";

interface DelegationItemBadgeProps extends React.HTMLProps<HTMLDivElement> {
  delegation:
    | DelegationsRouterOutputs["getDelegations"][0]
    | CommitteesRouterOutputs["getCommittee"]["person_applications"][0]["delegation"]
    | DelegationsRouterOutputs["getDelegation"];
}

export default function DelegationItemBadge(props: DelegationItemBadgeProps) {
  const delegationNameInfo = useDelegationName(props.delegation);

  if (delegationNameInfo.isLoading) return <Spinner />;

  if (!props.delegation) return null;

  return (
    <div {...props} className={`flex items-center gap-4 ${props.className}`}>
      <DelegationCircle delegation={props.delegation!} />
      <p className="font-bold">{delegationNameInfo.name}</p>
    </div>
  );
}
