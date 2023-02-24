import { useField } from "formik";
import { useState } from "react";
import Icon from "src/components/icons/Icon";
import FieldItem from "../FieldItem";
import TextInput from "./utils/TextInput";

interface PasswordInputFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({ name, label, ...props }) => {
  const [field, { error, touched }] = useField<string>(name);
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <FieldItem {...{ error, touched }}>
      <div className={`relative ${props.className}`}>
        <TextInput {...field} {...props} type={visible ? "text" : "password"} />
        <button type="button" onClick={() => setVisible(!visible)} className="absolute right-2 top-0 bottom-0">
          <Icon name={visible ? "eye-off" : "eye"} />
        </button>
      </div>
    </FieldItem>
  );
};

export default PasswordInputField;
