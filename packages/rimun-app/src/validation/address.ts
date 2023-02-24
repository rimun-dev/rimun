import * as Yup from "yup";

const addressValidationSchema = Yup.object({
  street: Yup.string().required(),
  number: Yup.string(),
  postal_code: Yup.string(),
  country: Yup.string(),
  locality: Yup.string().required(),
  administrative: Yup.string(),
  full_string: Yup.string().required(),
});

export default addressValidationSchema;
