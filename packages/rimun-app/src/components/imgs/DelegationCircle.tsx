import FlagCircle from "src/components/imgs/FlagCircle";
import StringCircle from "src/components/imgs/StringCircle";
import { CommitteesRouterOutputs, DelegationsRouterOutputs } from "src/trpc";

interface DelegationCircleProps extends React.HTMLProps<HTMLDivElement> {
  delegation:
    | DelegationsRouterOutputs["getDelegations"][0]
    | CommitteesRouterOutputs["getCommittee"]["person_applications"][0]["delegation"]
    | DelegationsRouterOutputs["getDelegation"];
}

export default function DelegationCircle(props: DelegationCircleProps) {
  switch (props.delegation?.type) {
    case "country":
      if (!props.delegation.country) return <StringCircle>N/A</StringCircle>;
      return <FlagCircle {...props} country={props.delegation.country} />;
    case "historical-country":
      return <StringCircle>HiC</StringCircle>;
    case "igo":
      return <StringCircle>IGO</StringCircle>;
    case "ngo":
      return <StringCircle>NGO</StringCircle>;
    default:
      return null;
  }
}
