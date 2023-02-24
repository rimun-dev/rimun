import { useField } from "formik";
import React, { HTMLProps } from "react";
import FieldItem from "../FieldItem";
import TextInput from "./utils/TextInput";

export interface TextInputFieldProps extends HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({ name, label, ...props }) => {
  const [field, { error, touched }] = useField<string>(name);
  return (
    <FieldItem {...{ error, touched }}>
      <TextInput {...props} {...field} id={field.name} />
    </FieldItem>
  );
};

export default TextInputField;
