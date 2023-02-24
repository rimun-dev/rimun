import { useNavigate } from "react-router-dom";
import CircularButton from "src/components/buttons/CircularButton";
import Card from "src/components/layout/Card";
import DelegationItemBadge from "src/components/layout/list/DelegationItemBadge";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { DelegationsRouterOutputs, trpc } from "src/trpc";
import useAuthenticatedState from "src/utils/useAuthenticatedState";

export default function SchoolDelegationsOverview() {
  const authState = useAuthenticatedState();

  const { data, isLoading } = trpc.delegations.getDelegations.useQuery(
    { school_id: authState.account.school!.id },
    { refetchOnWindowFocus: true, refetchOnMount: true }
  );

  if (isLoading || !data) return <Spinner />;

  return (
    <>
      <PageTitle>Delegations</PageTitle>
      <p className="mb-4">
        Here you can find delegations assigned to your school, manage your
        delegates, and assign them to different forum.
      </p>

      <Card className="p-4 mt-4">
        <div className="grid grid-cols-5 p-2 text-xs text-slate-500 font-bold">
          <div className="col-span-3">Delegation</div>
          <div className="col-span-1"># Delegates</div>
        </div>

        <div className="divide-y">
          {data.map((d) => (
            <SchoolDelegationItem key={d.id} delegationData={d} />
          ))}
        </div>
      </Card>
    </>
  );
}

interface SchoolDelegationItemProps {
  delegationData: DelegationsRouterOutputs["getDelegations"][0];
}

function SchoolDelegationItem(props: SchoolDelegationItemProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-5 w-full items-center p-4">
      <DelegationItemBadge
        delegation={props.delegationData}
        className="col-span-3"
      />

      <div className="flex items-center col-span-1 text-xs text-slate-500">
        {props.delegationData.person_applications.length}/
        {props.delegationData.n_delegates}
      </div>

      <div className="flex items-center justify-end col-span-1">
        <CircularButton
          icon="chevron-right"
          onClick={() =>
            navigate(`/dashboard/delegations/${props.delegationData.id}`)
          }
        />
      </div>
    </div>
  );
}
