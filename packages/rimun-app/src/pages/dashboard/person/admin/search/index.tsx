import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import CancelButton from "src/components/fields/base/CancelButton";
import Label from "src/components/fields/base/utils/Label";
import Select from "src/components/fields/base/utils/Select";
import FlagCircle from "src/components/imgs/FlagCircle";
import Card from "src/components/layout/Card";
import PersonSearchResultItem from "src/components/layout/list/PersonSearchResultItem";
import Spinner from "src/components/status/Spinner";
import SearchString from "src/components/text/SearchString";
import PageTitle from "src/components/typography/PageTitle";
import {
  InfoRouterOutputs,
  SearchRouterInputs,
  SearchRouterOutputs,
  trpc,
} from "src/trpc";
import useRolesInformation from "src/utils/useRolesInformation";

const MS_SEARCH_INTERVAL = 100;

export default function AdminSearch() {
  const [query, setQuery] = React.useState("");

  const [personFilters, setPersonFilters] = React.useState<
    SearchRouterInputs["searchPersons"]["filters"]
  >({});
  const [schoolFilters, setSchoolFilters] = React.useState<
    SearchRouterInputs["searchSchools"]["filters"]
  >({});

  const [showFilters, setShowFilters] = React.useState(false);
  const [userType, setUserType] = React.useState<"PERSON" | "SCHOOL">("PERSON");

  const lastQueryTimestamp = React.useRef(new Date());

  const schoolsQuery = trpc.search.searchSchools.useQuery(
    {
      limit: Number.MAX_SAFE_INTEGER,
      filters: schoolFilters,
      query,
    },
    {
      enabled: userType === "SCHOOL",
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const personsQuery = trpc.search.searchPersons.useQuery(
    {
      limit: Number.MAX_SAFE_INTEGER,
      filters: personFilters,
      query,
    },
    {
      enabled: userType === "PERSON",
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  React.useEffect(() => {
    if (
      Date.now() - lastQueryTimestamp.current.getTime() >
      MS_SEARCH_INTERVAL
    ) {
      userType === "PERSON" ? personsQuery.refetch() : schoolsQuery.refetch();
      lastQueryTimestamp.current = new Date();
    }
  }, [query, userType, personFilters, schoolFilters]);

  const isLoading =
    personsQuery.isLoading ||
    schoolsQuery.isLoading ||
    personsQuery.isRefetching ||
    schoolsQuery.isRefetching ||
    !personsQuery.data ||
    !schoolsQuery.data;

  return (
    <>
      <PageTitle>Search Tool</PageTitle>
      <div
        className={`w-full bg-white border-slate-200 border shadow-sm rounded-md`}
      >
        <div
          className={`flex gap-2 p-4 ${showFilters ? "border-b" : "border-0"}`}
        >
          <SearchBar {...{ query, setQuery }} />
          <Select className="flex-shrink-0">
            <option onSelect={() => setUserType("PERSON")}>Persons</option>
            <option onSelect={() => setUserType("SCHOOL")}>Schools</option>
          </Select>
          <CircularButton
            icon="adjustment-vertical"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-shrink-0"
          />
        </div>

        {showFilters &&
          (userType === "PERSON" ? (
            <PersonSearchFilters
              filters={personFilters}
              setFilters={setPersonFilters}
            />
          ) : (
            <SchoolSearchFilters
              filters={schoolFilters}
              setFilters={setSchoolFilters}
            />
          ))}
      </div>

      {isLoading && <Spinner className="mb-4" />}

      {!isLoading &&
        (userType === "PERSON" ? (
          <PersonSearchResults query={query} data={personsQuery.data} />
        ) : (
          <SchoolSearchResults query={query} data={schoolsQuery.data} />
        ))}
    </>
  );
}

interface SearchBarProps extends React.HTMLProps<HTMLInputElement> {
  query: string;
  setQuery: (s: string) => void;
}

function SearchBar({ query, setQuery, ...props }: SearchBarProps) {
  return (
    <input
      {...props}
      type="search"
      placeholder="Start typing..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className={`text-sm z-50 w-full rounded-md bg-slate-100 border border-slate-100 transition-shadow p-2 focus:shadow-md ${props.className}`}
    />
  );
}

interface SelectCountryInputProps {
  selectedCountryId: InfoRouterOutputs["getCountries"][0]["id"];
  setSelectedCountryId: (c: InfoRouterOutputs["getCountries"][0]["id"]) => void;
}

function SelectCountryInput(props: SelectCountryInputProps) {
  const { data, isLoading } = trpc.info.getCountries.useQuery();

  if (isLoading || !data) return <Spinner />;

  return (
    <Select
      value={data.find((c) => c.id === props.selectedCountryId)?.code ?? -1}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        const country = data.find((c) => c.code === e.target.value);
        if (country) props.setSelectedCountryId(country.id);
      }}
    >
      <option>Nothing selected</option>
      {data.map((c) => (
        <option key={c.id} value={c.code}>
          {c.name}
        </option>
      ))}
    </Select>
  );
}

interface PersonSearchFiltersProps {
  filters: SearchRouterInputs["searchPersons"]["filters"];
  setFilters: (f: SearchRouterInputs["searchPersons"]["filters"]) => void;
}

function PersonSearchFilters(props: PersonSearchFiltersProps) {
  const rolesInfo = useRolesInformation();

  if (rolesInfo.isLoading) return <Spinner />;

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-4 p-4">
        <Label className="flex flex-col gap-2">
          Nationality
          <SelectCountryInput
            selectedCountryId={props.filters.country_id ?? -1}
            setSelectedCountryId={(cid) =>
              props.setFilters({ ...props.filters, country_id: cid })
            }
          />
        </Label>

        <Label className="flex flex-col gap-2">
          Gender
          <Select
            value={props.filters.gender ?? undefined}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              props.setFilters({
                ...props.filters,
                gender: e.target
                  .value as SearchRouterInputs["searchPersons"]["filters"]["gender"],
              })
            }
          >
            <option>Nothing selected</option>
            <option value="m">Male</option>
            <option value="f">Female</option>
            <option value="nb">Non-binary</option>
          </Select>
        </Label>

        <Label className="flex flex-col gap-2">
          Application Status
          <Select
            value={props.filters.status_application ?? -1}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              props.setFilters({
                ...props.filters,
                status_application: e.target
                  .value as SearchRouterInputs["searchPersons"]["filters"]["status_application"],
              })
            }
          >
            <option>Nothing selected</option>
            <option value="HOLD">Hold</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REFUSED">Refused</option>
          </Select>
        </Label>

        <Label className="flex flex-col gap-2">
          Group
          <Select
            value={
              rolesInfo.groups.find(
                (g) => g.id === props.filters.confirmed_group_id
              )?.id ?? -1
            }
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              props.setFilters({
                ...props.filters,
                confirmed_group_id: Number.parseInt(e.target.value),
              })
            }
          >
            <option>Nothing selected</option>
            {rolesInfo.groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name.toUpperCase()}
              </option>
            ))}
          </Select>
        </Label>
      </div>

      <CancelButton onClick={() => props.setFilters({})} className="mx-4 mb-4">
        Reset Filters
      </CancelButton>
    </>
  );
}

interface PersonSearchResultsProps {
  query: string;
  data: SearchRouterOutputs["searchPersons"];
}

function PersonSearchResults(props: PersonSearchResultsProps) {
  return (
    <>
      <p className="text-right text-xs mt-4">
        Displaying <b>{props.data.result.length}</b> out of{" "}
        <b>{props.data.total_count}</b>
      </p>
      <Card className="p-4 mt-4">
        {props.data.result.map((pa) => (
          <PersonSearchResultItem
            key={pa.id}
            personApplicationData={pa}
            query={props.query}
          />
        ))}
      </Card>
    </>
  );
}

interface SchoolSearchFiltersProps {
  filters: SearchRouterInputs["searchSchools"]["filters"];
  setFilters: (f: SearchRouterInputs["searchSchools"]["filters"]) => void;
}

function SchoolSearchFilters(props: SchoolSearchFiltersProps) {
  return (
    <>
      <div className="grid lg:grid-cols-2 gap-4 p-4">
        <Label className="flex flex-col gap-2">
          Country
          <SelectCountryInput
            selectedCountryId={props.filters.country_id ?? -1}
            setSelectedCountryId={(cid) =>
              props.setFilters({ ...props.filters, country_id: cid })
            }
          />
        </Label>

        <Label className="flex flex-col gap-2">
          Application Status
          <Select
            value={props.filters.status_application ?? -1}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              props.setFilters({
                ...props.filters,
                status_application: e.target
                  .value as SearchRouterInputs["searchSchools"]["filters"]["status_application"],
              })
            }
          >
            <option>Nothing selected</option>
            <option value="HOLD">Hold</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REFUSED">Refused</option>
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
  data: SearchRouterOutputs["searchSchools"];
}

function SchoolSearchResults(props: SchoolSearchResultsProps) {
  return (
    <>
      <p className="text-right text-xs mt-4">
        Displaying <b>{props.data.result.length}</b> out of{" "}
        <b>{props.data.total_count}</b>
      </p>
      <Card className="p-4 mt-4">
        {props.data.result.map((sa) => (
          <SchoolSearchItem
            key={sa.id}
            schoolApplicationData={sa}
            query={props.query}
          />
        ))}
      </Card>
    </>
  );
}

interface SchoolSearchItemProps {
  query: string;
  schoolApplicationData: SearchRouterOutputs["searchSchools"]["result"][0];
}

export function SchoolSearchItem(props: SchoolSearchItemProps) {
  return (
    <button
      type="button"
      className="flex gap-4 items-center border border-slate-100 rounded-sm p-4 hover:bg-blue-50 w-full transition-colors text-left"
    >
      <FlagCircle country={props.schoolApplicationData.school.country} />
      <div>
        <p className="font-bold text-sm">
          <SearchString
            query={props.query}
            target={props.schoolApplicationData.school.name}
          />
        </p>
        <p className="font-light text-xs">
          {props.schoolApplicationData.school.account.email}
        </p>
      </div>
    </button>
  );
}
