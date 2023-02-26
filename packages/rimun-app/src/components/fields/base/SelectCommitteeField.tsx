import { useField } from "formik";
import React from "react";
import Select from "src/components/fields/base/utils/Select";
import FieldItem from "src/components/fields/FieldItem";
import Spinner from "src/components/status/Spinner";
import { InfoRouterOutputs, trpc } from "src/trpc";

interface SelectCommitteeFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

export default function SelectCommitteeField({
  name,
}: SelectCommitteeFieldProps) {
  const [field, { error, touched }, { setValue }] = useField<
    | InfoRouterOutputs["getForums"]["forums"][0]["committees"][0]["id"]
    | undefined
  >(name);

  const { data, isLoading } = trpc.info.getForums.useQuery();

  if (isLoading || !data) return <Spinner />;

  return (
    <FieldItem {...{ error, touched }}>
      <Select
        value={field.value?.toString()}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setValue(Number.parseInt(e.target.value))
        }
      >
        <option value={"-1"}>Not selected</option>
        {data.forums
          .flatMap((f) => f.committees)
          .map((c) => (
            <option key={c.id} value={c.id.toString()}>
              {c.name}
            </option>
          ))}
      </Select>
    </FieldItem>
  );
}
