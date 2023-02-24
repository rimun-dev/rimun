import PasswordInputField from "src/components/fields/base/PasswordInputField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";

export default function PartialAccountForm() {
  return (
    <>
      <Label htmlFor="email">
        Email
        <TextInputField
          name="email"
          placeholder="example@gmail.com"
          className="w-full"
          required
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor="password">
        Password
        <PasswordInputField
          name="password"
          placeholder="your-password-here"
          className="w-full"
          required
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor="confirm_password">
        Confirm Password
        <PasswordInputField
          name="confirm_password"
          placeholder="your-password-here"
          className="w-full"
          required
        />
      </Label>
    </>
  );
}
