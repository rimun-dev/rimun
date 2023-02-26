import Card from "src/components/layout/Card";
import SchoolHousingRequestItem from "src/components/layout/list/SchoolHousingRequestItem";
import Spinner from "src/components/status/Spinner";
import { trpc } from "src/trpc";

export default function SchoolList() {
  const { data, isLoading } = trpc.search.searchSchools.useQuery({
    limit: Number.MAX_SAFE_INTEGER,
    filters: { application: { status_application: "ACCEPTED" } },
  });

  const trpcCtx = trpc.useContext();

  const handleUpdate = () => {
    trpcCtx.search.searchSchools.invalidate({
      limit: Number.MAX_SAFE_INTEGER,
      filters: { application: { status_application: "ACCEPTED" } },
    });
    trpcCtx.housing.getStats.invalidate();
  };

  if (isLoading || !data) return <Spinner />;

  const filteredApplications = data.result.filter(
    (a) => a.status_housing !== "NOT_REQUIRED"
  );

  return (
    <Card className="overflow-y-hidden overflow-x-auto">
      <div style={{ minWidth: "628px" }}>
        <div className="grid grid-cols-6 p-2 text-xs text-slate-500 font-bold border-b">
          <div className="col-span-3">Name</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1"># Students</div>
        </div>

        <div className="flex flex-col divide-y">
          {filteredApplications.map((a) => (
            <SchoolHousingRequestItem
              key={a.id}
              schoolApplicationData={a}
              onUpdated={handleUpdate}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
