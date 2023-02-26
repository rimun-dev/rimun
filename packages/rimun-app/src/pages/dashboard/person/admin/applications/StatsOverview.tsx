import Card from "src/components/layout/Card";
import Spinner from "src/components/status/Spinner";
import { trpc } from "src/trpc";

export default function StatsOverview() {
  const { data, isLoading } = trpc.applications.getStats.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  if (isLoading || !data) return <Spinner />;

  const nDelegates =
    data.find((s) => s.group.name === "delegate")?.n_confirmed ?? 0;
  const nChair = data.find((s) => s.group.name === "chair")?.n_confirmed ?? 0;
  const nIcj = data.find((s) => s.group.name === "icj")?.n_confirmed ?? 0;
  const nStaff = data.find((s) => s.group.name === "staff")?.n_confirmed ?? 0;
  const nHistorical =
    data.find((s) => s.group.name === "hsc")?.n_confirmed ?? 0;

  return (
    <Card className="w-full overflow-x-auto">
      <div className="divide-x grid grid-cols-5" style={{ minWidth: "628px" }}>
        <div className="p-4">
          <p className="font-mono text-2xl font-bold">{nDelegates}</p>
          <p className="text-sm text-slate-500">Delegates</p>
        </div>

        <div className="p-4">
          <p className="font-mono text-2xl font-bold">{nChair}</p>
          <p className="text-sm text-slate-500">Chairs</p>
        </div>

        <div className="p-4">
          <p className="font-mono text-2xl font-bold">{nIcj}</p>
          <p className="text-sm text-slate-500">ICJ Members</p>
        </div>

        <div className="p-4">
          <p className="font-mono text-2xl font-bold">{nStaff}</p>
          <p className="text-sm text-slate-500">Staff Members</p>
        </div>

        <div className="p-4">
          <p className="font-mono text-2xl font-bold">{nHistorical}</p>
          <p className="text-sm text-slate-500">HSC Members</p>
        </div>
      </div>
    </Card>
  );
}
