import { useField } from "formik";
import CheckBoxInput from "src/components/fields/base/utils/CheckBoxInput";
import FieldItem from "src/components/fields/FieldItem";

interface CheckBoxFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

export default function CheckBoxField(props: CheckBoxFieldProps) {
  const [field, { error, touched }] = useField<string>(props.name);
  return (
    <FieldItem {...{ error, touched }}>
      <CheckBoxInput {...props} {...field} id={field.name} />
    </FieldItem>
  );
}
