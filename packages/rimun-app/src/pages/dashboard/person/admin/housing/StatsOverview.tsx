import Card from "src/components/layout/Card";
import Spinner from "src/components/status/Spinner";
import { trpc } from "src/trpc";

export default function StatsOverview() {
  const { data, isLoading } = trpc.housing.getStats.useQuery();

  if (isLoading || !data) return <Spinner />;

  const nTotRequests = data.n_hsc_requests + data.n_school_requests;
  const nTotMatched = data.n_hsc_matched + data.n_school_matched;

  return (
    <Card className="w-full overflow-x-auto">
      <div className="divide-x grid grid-cols-3" style={{ minWidth: "768px" }}>
        <div className="p-4">
          <p className="font-mono text-2xl font-bold">
            {nTotMatched}/{nTotRequests}
          </p>
          <p className="text-sm text-slate-500">Total Matched</p>
        </div>

        <div className="p-4">
          <p className="font-mono text-2xl font-bold">
            {data.n_school_matched}/{data.n_school_requests}
          </p>
          <p className="text-sm text-slate-500">Schools Matched</p>
        </div>

        <div className="p-4">
          <p className="font-mono text-2xl font-bold">
            {data.n_hsc_matched}/{data.n_hsc_requests}
          </p>
          <p className="text-sm text-slate-500">Historical Matched</p>
        </div>
      </div>
    </Card>
  );
}
