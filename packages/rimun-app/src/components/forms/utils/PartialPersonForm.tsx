import CountrySelectField from "src/components/fields/base/CountrySelectField";
import DateInputField from "src/components/fields/base/DateInputField";
import SelectField from "src/components/fields/base/SelectField";
import TextAreaField from "src/components/fields/base/TextAreaField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";

interface PartialPersonFormProps {
  fieldName?: string;
}

export default function PartialPersonForm(props: PartialPersonFormProps) {
  const renderFieldName = (name: string) => {
    return props.fieldName ? `${props.fieldName}.${name}` : name;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <Label htmlFor="name" className="md:mr-1">
          First name
          <TextInputField
            name={renderFieldName(`name`)}
            placeholder="John"
            className="w-full"
            required
          />
        </Label>

        <Label htmlFor="surname" className="md:ml-1 mt-2 md:mt-0">
          Last name
          <TextInputField
            name={renderFieldName(`surname`)}
            placeholder="Doe"
            className="w-full"
            required
          />
        </Label>
      </div>

      <div className="h-2" />

      <div className="flex flex-col md:flex-row">
        <Label htmlFor="birthday" className="w-full md:mr-1">
          Date of birth
          <DateInputField
            name={renderFieldName(`birthday`)}
            className="w-full"
            required
          />
        </Label>

        <Label htmlFor="gender" className="w-full md:ml-1 mt-2 md:mt-0">
          Gender
          <SelectField
            name={renderFieldName(`gender`)}
            className="w-full"
            options={[
              { name: "Male", value: "m" },
              { name: "Female", value: "f" },
              { name: "Non-binary", value: "nb" },
            ]}
          />
        </Label>
      </div>

      <div className="h-2" />

      <Label htmlFor="phone_number">
        Phone number (mobile)
        <TextInputField
          name={renderFieldName(`phone_number`)}
          placeholder="+39 333 2222111"
          className="w-full"
          required
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor="country_id">
        Nationality
        <CountrySelectField
          name={renderFieldName(`country_id`)}
          className="w-full"
          required
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor="tshirt_size" className="w-full md:ml-1">
        T-shirt Size
        <SelectField
          name={renderFieldName(`tshirt_size`)}
          className="w-full"
          options={[
            { name: "Small", value: "s" },
            { name: "Medium", value: "m" },
            { name: "Large", value: "l" },
            { name: "Extra Large", value: "xl" },
          ]}
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor="allergies">
        Allergies or Intolerances
        <TextAreaField
          name={renderFieldName(`allergies`)}
          placeholder="Write about your allergies (if applicable)..."
          className="w-full"
        />
      </Label>
    </>
  );
}
