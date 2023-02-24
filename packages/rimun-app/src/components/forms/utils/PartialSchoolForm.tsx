import AddressField from "src/components/fields/base/AddressField";
import CountrySelectField from "src/components/fields/base/CountrySelectField";
import TextInputField from "src/components/fields/base/TextInputField";
import Label from "src/components/fields/base/utils/Label";

export default function PartialSchoolForm() {
  return (
    <>
      <Label htmlFor="name">
        School/Organization name
        <TextInputField
          name="name"
          placeholder="E.g. Hogwarts School of Witchcraft and Wizardry"
          className="w-full"
          required
        />
      </Label>

      <div className="h-2" />

      <Label htmlFor="country_id">
        Country
        <CountrySelectField name="country_id" className="w-full" required />
      </Label>

      <div className="h-2" />

      <Label htmlFor="address">
        Address
        <AddressField
          name="address"
          placeholder="School address"
          className="w-full"
          required
        />
      </Label>
    </>
  );
}
