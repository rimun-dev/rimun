import Card from "src/components/layout/Card";
import PersonHousingRequestItem from "src/components/layout/list/PersonHousingRequestItem";
import Spinner from "src/components/status/Spinner";
import { SearchRouterInputs, trpc } from "src/trpc";

export default function HSCList() {
  const queryInput: SearchRouterInputs["searchPersons"] = {
    limit: Number.MAX_SAFE_INTEGER,
    filters: {
      application: {
        status_application: "ACCEPTED",
        confirmed_group: { name: "hsc" },
      },
    },
  };

  const { data, isLoading } = trpc.search.searchPersons.useQuery(queryInput);

  const trpcCtx = trpc.useContext();

  const handleUpdate = () =>
    trpcCtx.search.searchPersons.invalidate(queryInput);

  if (isLoading || !data) return <Spinner />;

  return (
    <Card className="overflow-y-hidden overflow-x-auto">
      <div style={{ minWidth: "628px" }}>
        <div className="grid grid-cols-5 p-2 text-xs text-slate-500 font-bold border-b">
          <div className="col-span-3">Name</div>
          <div className="col-span-1">Status</div>
        </div>

        <div className="flex flex-col divide-y">
          {data.result.map((a) => {
            return (
              <PersonHousingRequestItem
                key={a.id}
                personApplicationData={a}
                onUpdated={handleUpdate}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}
