import { TrpcRouter } from "@rimun/api";
import { inferRouterInputs } from "@trpc/server";
import { useField } from "formik";
import React from "react";
import FieldItem from "src/components/fields/FieldItem";
import PersonSearchResultItem from "src/components/layout/list/PersonSearchResultItem";
import Spinner from "src/components/status/Spinner";
import { SearchRouterOutputs, trpc } from "src/trpc";

interface SearchPersonFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
  maxResults?: number;
  filters?: inferRouterInputs<TrpcRouter>["search"]["searchPersons"]["filters"];
}

const N_RESULTS_DEFAULT = 5;

export default function SearchPersonField({
  name,
  maxResults,
  filters = {},
  ...props
}: SearchPersonFieldProps) {
  const [query, setQuery] = React.useState("");
  const [field, { error, touched }, { setValue }] = useField<
    SearchRouterOutputs["searchPersons"]["result"][0]["person_id"] | undefined
  >(name);

  const enableQuery = query.length > 0;

  const { data, isLoading } = trpc.search.searchPersons.useQuery(
    { limit: maxResults ?? N_RESULTS_DEFAULT, query, filters },
    { enabled: enableQuery }
  );

  const selectedPerson = data?.result.find(
    (pa) => pa.person_id === field.value
  )?.person;

  return (
    <FieldItem {...{ error, touched }}>
      {field.value && selectedPerson ? (
        <PersonSearchResultItem
          personData={selectedPerson}
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
              <PersonSearchResultItem
                key={item.id}
                personData={item.person}
                query={query}
                onClick={() => setValue(item.person_id)}
              />
            ))}
          </div>

          {isLoading && enableQuery && <Spinner />}
        </>
      )}
    </FieldItem>
  );
}
