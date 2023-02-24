import { useField } from "formik";
import React from "react";
import FieldItem from "src/components/fields/FieldItem";

interface SwitchFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

export default function SwitchField({ name, label, ...props }: SwitchFieldProps) {
  const [field, { error, touched }, { setValue }] = useField<boolean>(name);
  return (
    <FieldItem {...{ error, touched }}>
      <button
        type="button"
        className="flex items-center cursor-pointer relative"
        onClick={() => setValue(!field.value)}
      >
        <input
          {...field}
          value={field.value ? 1 : 0}
          checked={field.value}
          type="checkbox"
          id="toggle-example"
          {...props}
          className={`sr-only ${props.className}`}
        />
        <div className="toggle-bg bg-slate-200 border-2 border-slate-200 h-6 w-11 rounded-full"></div>
        <span className="text-xs ml-2">{field.value ? "Yes" : "No"}</span>
      </button>
    </FieldItem>
  );
}
