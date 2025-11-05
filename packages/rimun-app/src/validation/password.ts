import * as Yup from "yup";

const passwordValidationSchema = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters long")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(/[!@#$%^&*]/, "Password must contain at least one special character such as !, @, #, $, %, ^, &, or *");

export default passwordValidationSchema;
