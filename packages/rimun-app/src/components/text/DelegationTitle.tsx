import DelegationCircle from "src/components/imgs/DelegationCircle";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { DelegationsRouterOutputs } from "src/trpc";
import { useDelegationName } from "src/utils/strings";

export default function DelegationTitle(props: {
  delegation: DelegationsRouterOutputs["getDelegation"];
}) {
  const delegationNameInfo = useDelegationName(props.delegation);

  if (delegationNameInfo.isLoading) return <Spinner />;

  return (
    <div className="flex gap-6 items-center">
      <DelegationCircle delegation={props.delegation} />
      <PageTitle className="mb-0">{delegationNameInfo.name}</PageTitle>
    </div>
  );
}
