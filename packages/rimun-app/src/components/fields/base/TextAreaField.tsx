import { useField } from "formik";
import React, { HTMLProps } from "react";
import FieldItem from "../FieldItem";

export interface TextAreaFieldProps extends HTMLProps<HTMLTextAreaElement> {
  name: string;
  label?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ name, label, ...props }) => {
  const [field, { error, touched }] = useField<string>(name);

  return (
    <FieldItem {...{ error, touched }}>
      <textarea
        {...props}
        {...field}
        className={`text-sm rounded-md bg-slate-100 border border-slate-200 bg-opacity-40 transition-shadow p-2 focus:outline-brand ${props.className}`}
      />
      {props.maxLength && (
        <p className="text-xs text-slate-500 lowercase font-light">
          {field.value.length} out of {props.maxLength} characters
        </p>
      )}
    </FieldItem>
  );
};

export default TextAreaField;
