import React from "react";
import { useQuery } from "react-query";
import CancelButton from "src/components/fields/base/CancelButton";
import Label from "src/components/fields/base/utils/Label";
import Select from "src/components/fields/base/utils/Select";
import FlagCircle from "src/components/imgs/FlagCircle";
import Card from "src/components/layout/Card";
import Spinner from "src/components/status/Spinner";
import SearchString from "src/components/text/SearchString";
import Rimun from "src/entities";
import { infoService } from "src/services";
import { SearchService } from "src/services/search";
import { SuccessResponse } from "src/services/service";

interface SchoolSearchFiltersProps {
  filters: SearchService.SearchSchoolsRequestFilters;
  setFilters: (f: SearchService.SearchSchoolsRequestFilters) => void;
}

export function SchoolSearchFilters(props: SchoolSearchFiltersProps) {
  const { data, isLoading } = useQuery(["info", "countries"], () => infoService.getCountries(), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-4 p-4">
        <Label className="flex flex-col gap-2">
          Country
          {isLoading || !data ? (
            <Spinner />
          ) : (
            <Select
              value={data.data.countries.find((c) => c.id === props.filters.country_id)?.code ?? -1}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const country = data.data.countries.find((c) => c.code === e.target.value);
                if (country) props.setFilters({ ...props.filters, country_id: country.id });
              }}
            >
              <option>Nothing selected</option>
              {data.data.countries.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          )}
        </Label>

        <Label className="flex flex-col gap-2">
          Application Status
          <Select
            value={props.filters.status_application ?? -1}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              props.setFilters({ ...props.filters, status_application: e.target.value as Rimun.EnrolmentStage })
            }
          >
            <option>Nothing selected</option>
            <option value="hold">Hold</option>
            <option value="accepted">Accepted</option>
            <option value="refused">Refused</option>
          </Select>
        </Label>
      </div>

      <CancelButton onClick={() => props.setFilters({})} className="mx-4 mb-4">
        Reset Filters
      </CancelButton>
    </>
  );
}

interface SchoolSearchResultsProps {
  query: string;
  data: SuccessResponse<SearchService.SearchSchoolsResponse>[];
  fetchNextPage: Function;
  hasMore: boolean;
}

export function SchoolSearchResults(props: SchoolSearchResultsProps) {
  return (
    <>
      <p className="text-right text-xs mt-4">
        Displaying <b>{props.data.map((d) => d.data.schools.length).reduce((acc = 0, crt) => acc + crt, 0)}</b> out of{" "}
        <b>{props.data[0]?.data.total_count}</b>
      </p>
      <Card className="p-4 mt-4">
        {props.data.map((page) =>
          page.data.schools.map((s) => {
            const a = page.data.accounts.find((a) => a.id === s.account_id);
            return <SchoolSearchItem key={s.id} account={a} school={s} query={props.query} />;
          })
        )}
      </Card>
    </>
  );
}

interface SchoolSearchItemProps {
  query: string;
  school: Rimun.School;
  account?: Rimun.Account;
}

export function SchoolSearchItem(props: SchoolSearchItemProps) {
  return (
    <button
      type="button"
      className="flex gap-4 items-center border border-slate-100 rounded-sm p-4 hover:bg-blue-50 w-full transition-colors text-left"
    >
      <FlagCircle countryId={props.school.country_id} />
      <div>
        <p className="font-bold text-sm">
          <SearchString query={props.query} target={props.school.name} />
        </p>
        <p className="font-light text-xs">{props.account?.email}</p>
      </div>
    </button>
  );
}
