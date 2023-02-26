import PasswordInputField from "src/components/fields/base/PasswordInputField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";

interface PartialAccountFormProps {
  fieldName?: string;
}

export default function PartialAccountForm(props: PartialAccountFormProps) {
  const renderFieldName = (name: string) => {
    return props.fieldName ? `${props.fieldName}.${name}` : name;
  };

  return (
    <>
      <Label htmlFor={renderFieldName("email")}>
        Email
        <TextInputField
          name={renderFieldName("email")}
          placeholder="example@gmail.com"
          className="w-full"
          required
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor={renderFieldName("password")}>
        Password
        <PasswordInputField
          name={renderFieldName("password")}
          placeholder="your-password-here"
          className="w-full"
          required
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor={renderFieldName("confirm_password")}>
        Confirm Password
        <PasswordInputField
          name={renderFieldName("confirm_password")}
          placeholder="your-password-here"
          className="w-full"
          required
        />
      </Label>
    </>
  );
}
