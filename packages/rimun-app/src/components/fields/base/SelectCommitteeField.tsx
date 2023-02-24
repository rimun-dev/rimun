import { useField } from "formik";
import React from "react";
import { useQuery } from "react-query";
import Select from "src/components/fields/base/utils/Select";
import FieldItem from "src/components/fields/FieldItem";
import Spinner from "src/components/status/Spinner";
import Rimun from "src/entities";
import { infoService } from "src/services";

interface SelectCommitteeFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

export default function SelectCommitteeField({ name }: SelectCommitteeFieldProps) {
  const [field, { error, touched }, { setValue }] = useField<Rimun.Identifier | undefined>(name);

  const { data, isLoading } = useQuery(["info", "forums"], () => infoService.getForums());

  if (isLoading || !data) return <Spinner />;

  return (
    <FieldItem {...{ error, touched }}>
      <Select
        value={field.value?.toString()}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setValue(Number.parseInt(e.target.value))}
      >
        <option value={"-1"}>Not selected</option>
        {data.data.committees.map((c) => (
          <option key={c.id} value={c.id.toString()}>
            {c.name}
          </option>
        ))}
      </Select>
    </FieldItem>
  );
}
