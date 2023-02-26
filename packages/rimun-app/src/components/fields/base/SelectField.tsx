import { useField } from "formik";
import React from "react";
import FieldItem from "../FieldItem";
import Select from "./utils/Select";

type Option<T> = {
  name: string;
  value: T;
};

export interface SelectFieldProps extends React.HTMLProps<HTMLSelectElement> {
  name: string;
  options: Option<string | number>[];
}

export default function SelectField({
  name,
  options,
  ...props
}: SelectFieldProps) {
  const [field, { error, touched }, { setValue }] = useField(name);
  return (
    <FieldItem {...{ error, touched }}>
      <Select
        {...props}
        value={options.find((o) => o.value === field.value)?.name}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const option = options.find((o) => o.name === e.target.value);
          if (option) setValue(option.value);
        }}
      >
        <option>Select an option</option>
        {options.map((opt) => (
          <option key={opt.name} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </Select>
    </FieldItem>
  );
}
