import AddressField from "src/components/fields/base/AddressField";
import NumberInputField from "src/components/fields/base/NumberInputField";
import PhoneNumberField from "src/components/fields/base/PhoneNumberField";
import SelectField from "src/components/fields/base/SelectField";
import SwitchField from "src/components/fields/base/SwitchField";
import TextAreaField from "src/components/fields/base/TextAreaField";
import Label from "src/components/fields/base/utils/Label";
import Banner from "src/components/status/Banner";

export default function HousingOfferPartialForm(props: { isAvailable: boolean }) {
  return (
    <>
      <Label htmlFor="housing_is_available" className="w-full">
        Do you want to offer housing to other students?
        <SwitchField name="housing_is_available" />
      </Label>

      <Banner status="info" title="Housing">
        Hosting foreign students is not mandatory but it highly influences the Secretariat choices when reviewing your
        application, if you can&apos;t host one or more foreign students for any valid reason you should contact our
        team and explain your situation (
        <a className="text-blue-500" href="mailto:info@rimun.com">
          info@rimun.com
        </a>
        ).
      </Banner>

      {props.isAvailable && (
        <>
          <Label htmlFor="housing_n_guests" className="block w-full mt-4">
            Fill in the maximum number of guests that you can host:
            <NumberInputField name="housing_n_guests" />
          </Label>

          <Label htmlFor="housing_gender_preference" className="w-full mt-4">
            Do you have a preference with regard to gender of the guests?
            <SelectField
              name="housing_gender_preference"
              className="w-full"
              options={[
                { name: "Male", value: "m" },
                { name: "Female", value: "f" },
                { name: "No Preference", value: "" },
              ]}
            />
          </Label>

          <h3 className="block mt-4 font-bold text-sm mb-2">Details about your house</h3>
          <AddressField name="housing_address" className="w-full" required />

          <Label htmlFor="housing_pets" className="block w-full mt-4">
            Do you have any pet animal at home? List all of them down below:
            <TextAreaField
              name="housing_pets"
              placeholder="Write them down here..."
              className="w-full h-24"
              maxLength={1000}
            />
          </Label>

          <Label htmlFor="housing_phone_number" className="block w-full mt-4">
            Your home phone number
            <PhoneNumberField name="housing_phone_number" placeholder="+39 06 444 888 99" className="w-full" required />
          </Label>
        </>
      )}
    </>
  );
}
