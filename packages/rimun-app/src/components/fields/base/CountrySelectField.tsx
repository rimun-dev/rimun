import { useField } from "formik";
import React from "react";
import Spinner from "src/components/status/Spinner";
import { InfoRouterOutputs, trpc } from "src/trpc";
import FieldItem from "../FieldItem";
import Select from "./utils/Select";

interface CountrySelectFieldProps extends React.HTMLProps<HTMLSelectElement> {
  name: string;
}

const CountrySelectField: React.FC<CountrySelectFieldProps> = ({
  name,
  ...props
}) => {
  const [field, { error, touched }, { setValue }] =
    useField<InfoRouterOutputs["getCountries"][0]["id"]>(name);

  const { data, isLoading } = trpc.info.getCountries.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <FieldItem {...{ error, touched }}>
      {isLoading || !data ? (
        <Spinner />
      ) : (
        <Select
          {...props}
          value={field.value}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const country = data.find(
              (c) => c.id === Number.parseInt(e.target.value)
            );
            if (country) setValue(country.id);
          }}
        >
          <option key={-1}>Select a country</option>
          {data.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      )}
    </FieldItem>
  );
};

export default CountrySelectField;
