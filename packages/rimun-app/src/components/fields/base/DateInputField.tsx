import { useField } from "formik";
import React from "react";
import FieldItem from "../FieldItem";
import TextInput from "./utils/TextInput";

interface DateInputFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

const DateInputField: React.FC<DateInputFieldProps> = ({ name, ...props }) => {
  const [field, { error, touched }, { setValue }] = useField<Date>(name);

  let defaultInputText;
  try {
    defaultInputText = field.value ? field.value.toISOString().split("T")[0] : undefined;
  } catch (e) {}

  const [inputText, setInputText] = React.useState(defaultInputText);
  return (
    <FieldItem {...{ error, touched }}>
      <TextInput
        {...field}
        {...props}
        type="date"
        id={field.name}
        value={inputText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          try {
            setInputText(e.target.value);
            setValue(new Date(e.target.value));
          } catch (e) {}
        }}
      />
    </FieldItem>
  );
};

export default DateInputField;
