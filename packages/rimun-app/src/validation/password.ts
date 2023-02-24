import * as Yup from "yup";

const passwordValidationSchema = Yup.string().matches(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
  "The password must contain at least 1 special character, 1 number, and 1 uppercase letter."
);

export default passwordValidationSchema;
