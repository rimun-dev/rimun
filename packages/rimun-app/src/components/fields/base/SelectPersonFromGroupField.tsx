import { useField } from "formik";
import React from "react";
import { useQuery } from "react-query";
import FieldItem from "src/components/fields/FieldItem";
import PersonSearchResultItem from "src/components/layout/list/PersonSearchResultItem";
import Spinner from "src/components/status/Spinner";
import Rimun from "src/entities";
import { searchService } from "src/services";

interface SelectPersonFromGroupFieldProps extends React.HTMLProps<HTMLInputElement> {
  groupId: Rimun.Identifier;
  name: string;
  label?: string;
}

export default function SelectPersonFromGroupField(props: SelectPersonFromGroupFieldProps) {
  const [query, setQuery] = React.useState("");
  const [field, { error, touched }, { setValue }] = useField<Rimun.Identifier | undefined>(props.name);

  const { data, isLoading } = useQuery(["search", "persons", query], () =>
    searchService.searchPersons({
      limit: Number.MAX_SAFE_INTEGER,
      query,
      filters: { confirmed_group_id: props.groupId },
    })
  );

  const selectedPerson = data?.data.persons.find((p) => p.id === field.value);
  const selectedAccount = data?.data.accounts.find((a) => a.id === selectedPerson?.account_id);

  return (
    <FieldItem {...{ error, touched }}>
      {field.value && selectedPerson ? (
        <PersonSearchResultItem account={selectedAccount} person={selectedPerson} onClick={() => setValue(undefined)} />
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
            {data?.data.persons.map((person) => {
              const account = data.data.accounts.find((a) => a.id === person.account_id);
              return (
                <PersonSearchResultItem
                  key={person.id}
                  account={account}
                  person={person}
                  query={query}
                  onClick={() => setValue(person.id)}
                />
              );
            })}
          </div>

          {isLoading && <Spinner />}
        </>
      )}
    </FieldItem>
  );
}
