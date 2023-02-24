import * as Yup from "yup";

const countryValidationSchema = Yup.object({
  name: Yup.string().required(),
  code: Yup.string().required(),
});

export default countryValidationSchema;
