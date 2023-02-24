import { useField } from "formik";
import React from "react";
import Label from "src/components/fields/base/utils/Label";
import FieldItem from "../FieldItem";
import TextInput from "./utils/TextInput";

interface AddressFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

// NOTE: this mimicks the Google Maps data structure.
// We should convert the address to the business format
// just before calling any API. But this should be kept
// here for future compatibility with Google's APIs.
interface Address {
  street: string;
  number?: string;
  locality: string;
  postal_code?: string;
  administrative?: string;
  country?: string;
  full_string?: string;
}

const AddressField: React.FC<AddressFieldProps> = ({ name, label, ...props }) => {
  const [{ value }, { error, touched }, { setValue }] = useField<Address>(name);

  const makeFullString = () => {
    let out = "";
    if (!value) return out;
    if (value.street) out += `${value.street}, `;
    if (value.number) out += `${value.number}, `;
    if (value.locality) out += value.locality;
    return out;
  };

  return (
    <FieldItem {...{ error, touched }}>
      <Label htmlFor={`${name}.street`} className="w-full">
        Street Name
        <TextInput
          {...props}
          name={`${name}.street`}
          value={value.street}
          placeholder="Downing Street"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue({
              ...(value ?? {}),
              street: e.target.value,
              full_string: makeFullString(),
            });
          }}
        />
      </Label>

      <div className="flex flex-col md:flex-row mt-2">
        <Label htmlFor={`${name}.number`} className="w-full">
          Civic Number
          <TextInput
            {...props}
            name={`${name}.number`}
            value={value.number}
            placeholder="10"
            className="flex-1 md:mr-1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValue({
                ...(value ?? {}),
                number: e.target.value,
                full_string: makeFullString(),
              });
            }}
          />
        </Label>

        <Label htmlFor={`${name}.postal_code`} className="w-full">
          Postal Code
          <TextInput
            {...props}
            name={`${name}.postal_code`}
            value={value.postal_code}
            placeholder="SW1A"
            className="flex-1 md:mr-1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValue({
                ...(value ?? {}),
                postal_code: e.target.value,
                full_string: makeFullString(),
              });
            }}
          />
        </Label>
      </div>

      <Label htmlFor={`${name}.locality`} className="w-full mt-4">
        City
        <TextInput
          {...props}
          name={`${name}.locality`}
          value={value.locality}
          placeholder="London"
          className="w-full"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue({
              ...(value ?? {}),
              locality: e.target.value,
              full_string: makeFullString(),
            });
          }}
        />
      </Label>
    </FieldItem>
  );
};

export default AddressField;
