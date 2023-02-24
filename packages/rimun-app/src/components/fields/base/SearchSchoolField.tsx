import { TrpcRouter } from "@rimun/api";
import { inferRouterInputs } from "@trpc/server";
import { useField } from "formik";
import React from "react";
import FieldItem from "src/components/fields/FieldItem";
import SchoolSearchResultItem from "src/components/layout/list/SchoolSearchResultItem";
import Spinner from "src/components/status/Spinner";
import { SearchRouterOutputs, trpc } from "src/trpc";

interface SearchSchoolFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
  maxResults?: number;
  filters?: inferRouterInputs<TrpcRouter>["search"]["searchSchools"]["filters"];
}

const N_RESULTS_DEFAULT = 5;

export default function SearchSchoolField({
  name,
  maxResults,
  filters = {},
  ...props
}: SearchSchoolFieldProps) {
  const [query, setQuery] = React.useState("");
  const [field, { error, touched }, { setValue }] = useField<
    SearchRouterOutputs["searchSchools"]["result"][0]["school_id"] | undefined
  >(name);

  const { data, isLoading } = trpc.search.searchSchools.useQuery(
    { limit: maxResults ?? N_RESULTS_DEFAULT, query, filters },
    { enabled: query.length > 0 }
  );

  const selectedSchool = data?.result.find(
    (item) => item.school_id === field.value
  )?.school;

  return (
    <FieldItem {...{ error, touched }}>
      {field.value && selectedSchool ? (
        <SchoolSearchResultItem
          school={selectedSchool}
          onClick={() => setValue(undefined)}
        />
      ) : (
        <>
          <input
            {...props}
            type="search"
            placeholder="Start typing..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`text-sm z-50 w-full rounded-md bg-slate-100 border border-slate-100 transition-shadow p-2 focus:shadow-md ${props.className}`}
          />

          <div className="flex flex-col max-h-40 overflow-y-scroll">
            {data?.result.map((item) => (
              <SchoolSearchResultItem
                key={item.school_id}
                school={item.school}
                query={query}
                onClick={() => setValue(item.school_id)}
              />
            ))}
          </div>

          {isLoading && <Spinner />}
        </>
      )}
    </FieldItem>
  );
}
