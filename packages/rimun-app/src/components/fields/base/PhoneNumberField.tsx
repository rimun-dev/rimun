import { useField } from "formik";
import TextInput from "src/components/fields/base/utils/TextInput";
import FieldItem from "src/components/fields/FieldItem";

interface PhoneNumberFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

export default function PhoneNumberField({ name, label, ...props }: PhoneNumberFieldProps) {
  const [field, { error, touched }] = useField<string>(name);
  return (
    <FieldItem {...{ error, touched }}>
      <TextInput {...props} {...field} type="tel" id={field.name} />
    </FieldItem>
  );
}
