import Card from "src/components/layout/Card";
import PersonHousingRequestItem from "src/components/layout/list/PersonHousingRequestItem";
import Spinner from "src/components/status/Spinner";
import { trpc } from "src/trpc";
import useRolesInformation from "src/utils/useRolesInformation";

export default function HSCList() {
  const rolesInfo = useRolesInformation();

  const { data, isLoading } = trpc.search.searchPersons.useQuery(
    {
      limit: Number.MAX_SAFE_INTEGER,
      filters: {
        status_application: "ACCEPTED",
        confirmed_group_id: rolesInfo.isLoading
          ? -1
          : rolesInfo.getGroupIdByName("hsc"),
      },
    },
    { enabled: !rolesInfo.isLoading }
  );

  const trpcCtx = trpc.useContext();

  if (isLoading || rolesInfo.isLoading || !data) return <Spinner />;

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
                person={a.person}
                application={a}
                onUpdated={() =>
                  trpcCtx.search.searchPersons.invalidate({
                    limit: Number.MAX_SAFE_INTEGER,
                    filters: {
                      status_application: "ACCEPTED",
                      confirmed_group_id: rolesInfo.getGroupIdByName("hsc"),
                    },
                  })
                }
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}
