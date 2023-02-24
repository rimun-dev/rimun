import { useField } from "formik";
import React from "react";
import FieldItem from "src/components/fields/FieldItem";

interface NumberInputFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

export default function NumberInputField({ name, ...props }: NumberInputFieldProps) {
  const [field, { error, touched }] = useField<number>(name);
  return (
    <FieldItem {...{ error, touched }}>
      <input
        {...props}
        type="number"
        {...field}
        id={field.name}
        className={`text-sm rounded-md bg-slate-100 border border-slate-200 bg-opacity-40 transition-shadow p-2 focus:outline-brand ${props.className}`}
      />
    </FieldItem>
  );
}
