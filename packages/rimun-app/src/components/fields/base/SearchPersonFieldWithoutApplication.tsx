import { useField } from "formik";
import React from "react";
import FieldItem from "src/components/fields/FieldItem";
import PersonSearchResultItem from "src/components/layout/list/PersonSearchResultItem";
import Spinner from "src/components/status/Spinner";
import { SearchRouterOutputs, trpc } from "src/trpc";

interface SearchPersonWithoutApplicationFieldProps
  extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
  maxResults?: number;
}

const N_RESULTS_DEFAULT = 5;

export default function SearchPersonWithoutApplicationField({
  name,
  maxResults,
  ...props
}: SearchPersonWithoutApplicationFieldProps) {
  const [query, setQuery] = React.useState("");
  const [field, { error, touched }, { setValue }] = useField<
    | SearchRouterOutputs["searchPersonsWithoutApplication"]["result"][0]["id"]
    | undefined
  >(name);

  const { data, isLoading } =
    trpc.search.searchPersonsWithoutApplication.useQuery(
      { limit: maxResults ?? N_RESULTS_DEFAULT, query },
      { enabled: query.length > 0 }
    );

  const selectedPerson = data?.result.find((pa) => pa.id === field.value);

  return (
    <FieldItem {...{ error, touched }}>
      {field.value && selectedPerson ? (
        <PersonSearchResultItem
          person={selectedPerson}
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
                person={item}
                query={query}
                onClick={() => setValue(item.id)}
              />
            ))}
          </div>

          {isLoading && <Spinner />}
        </>
      )}
    </FieldItem>
  );
}
