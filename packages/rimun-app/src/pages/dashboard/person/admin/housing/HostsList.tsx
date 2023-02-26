import React from "react";
import Label from "src/components/fields/base/utils/Label";
import Select from "src/components/fields/base/utils/Select";
import Card from "src/components/layout/Card";
import PersonHostItem from "src/components/layout/list/PersonHostItem";
import Spinner from "src/components/status/Spinner";
import { SearchRouterInputs, trpc } from "src/trpc";

export default function HostList() {
  const [schoolFilter, setSchoolFilter] = React.useState<number>();

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

  const handleUpdate = () =>
    trpcCtx.search.searchPersons.invalidate(queryInput);

  if (!data || isLoading) return <Spinner />;

  const filteredApplications = schoolFilter
    ? data.result.filter((a) => a.school_id === schoolFilter)
    : data.result;

  return (
    <>
      <Label className="w-full block my-4">
        Filter guests by school
        <Select className="w-full">
          <option onSelect={() => setSchoolFilter(undefined)}>
            All Schools
          </option>
          {data.result.map((ad) =>
            !!ad.school ? (
              <option
                key={ad.school.id}
                onSelect={() => setSchoolFilter(ad.school?.id)}
              >
                {ad.school.name}
              </option>
            ) : null
          )}
        </Select>
      </Label>
      <Card className="overflow-y-hidden overflow-x-auto">
        <div style={{ minWidth: "628px" }}>
          <div className="grid grid-cols-5 p-2 text-xs text-slate-500 font-bold border-b">
            <div className="col-span-2">Name</div>
            <div className="col-span-2">Matches/Availability</div>
          </div>
          <div className="flex flex-col divide-y">
            {filteredApplications.map((a) => (
              <PersonHostItem
                key={a.id}
                hostApplicationData={a}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
