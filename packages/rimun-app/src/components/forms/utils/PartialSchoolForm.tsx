import AddressField from "src/components/fields/base/AddressField";
import CountrySelectField from "src/components/fields/base/CountrySelectField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";

interface PartialSchoolFormProps {
  fieldName?: string;
}

export default function PartialSchoolForm(props: PartialSchoolFormProps) {
  const renderFieldName = (name: string) => {
    return props.fieldName ? `${props.fieldName}.${name}` : name;
  };

  return (
    <>
      <Label htmlFor={renderFieldName("name")}>
        School/Organization name
        <TextInputField
          name={renderFieldName("name")}
          placeholder="E.g. Hogwarts School of Witchcraft and Wizardry"
          className="w-full"
          required
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor={renderFieldName("country_id")}>
        Country
        <CountrySelectField
          name={renderFieldName("country_id")}
          className="w-full"
          required
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor={renderFieldName("address")}>
        Address
        <AddressField
          name={renderFieldName("address")}
          placeholder="School address"
          className="w-full"
          required
        />
      </Label>
    </>
  );
}
