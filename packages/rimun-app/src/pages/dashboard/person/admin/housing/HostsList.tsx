import Card from "src/components/layout/Card";
import PersonHostItem from "src/components/layout/list/PersonHostItem";
import Spinner from "src/components/status/Spinner";
import { SearchRouterInputs, trpc } from "src/trpc";

export default function HostList() {
  const queryInput = {
    limit: Number.MAX_SAFE_INTEGER,
    filters: {
      application: {
        status_application: "ACCEPTED",
        housing_is_available: true,
      },
    },
  } as SearchRouterInputs["searchPersons"];

  const { data, isLoading } = trpc.search.searchPersons.useQuery(queryInput);

  const trpcCtx = trpc.useContext();

  const handleUpdate = () => {
    trpcCtx.housing.getStats.invalidate();
    trpcCtx.search.searchPersons.invalidate(queryInput);
  };

  if (!data || isLoading) return <Spinner />;

  return (
    <Card className="overflow-y-auto overflow-x-auto">
      <div style={{ minWidth: "628px" }}>
        <div className="grid grid-cols-5 p-2 text-xs text-slate-500 font-bold border-b">
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Matches/Availability</div>
        </div>
        <div className="flex flex-col divide-y">
          {data.result.map((a) => (
            <PersonHostItem
              key={a.id}
              hostApplicationData={a}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
