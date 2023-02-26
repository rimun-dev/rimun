import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useField } from "formik";
import { useState } from "react";
import FieldItem from "../FieldItem";
import TextInput from "./utils/TextInput";

interface PasswordInputFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  name,
  label,
  ...props
}) => {
  const [field, { error, touched }] = useField<string>(name);
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <FieldItem {...{ error, touched }}>
      <div className={`relative ${props.className}`}>
        <TextInput {...field} {...props} type={visible ? "text" : "password"} />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-2 top-0 bottom-0"
        >
          {visible ? (
            <EyeSlashIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </FieldItem>
  );
};

export default PasswordInputField;
