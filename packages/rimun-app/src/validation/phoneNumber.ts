import * as Yup from "yup";

const phoneNumberValidationSchema = Yup.string().matches(
  /^\+?[0-9 ]+/,
  "Insert a valid phone number."
);

export default phoneNumberValidationSchema;
