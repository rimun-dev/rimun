import DelegationCircle from "src/components/imgs/DelegationCircle";
import PageTitle from "src/components/typography/PageTitle";
import { DelegationsRouterOutputs } from "src/trpc";
import { renderDelegationName } from "src/utils/strings";

export default function DelegationTitle(props: {
  delegation: DelegationsRouterOutputs["getDelegation"];
}) {
  return (
    <div className="flex gap-6 items-center">
      <DelegationCircle delegation={props.delegation} />
      <PageTitle className="mb-0">
        {renderDelegationName(props.delegation)}
      </PageTitle>
    </div>
  );
}
