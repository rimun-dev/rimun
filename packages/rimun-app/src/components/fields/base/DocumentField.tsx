import { useField } from "formik";
import React from "react";
import FieldItem from "src/components/fields/FieldItem";
import toBase64 from "src/utils/toBase64";

interface DocumentFieldProps extends React.HTMLProps<HTMLInputElement> {
  name: string;
  label?: string;
}

export default function DocumentField({ name, ...props }: DocumentFieldProps) {
  const [field, { error, touched }, { setValue }] = useField<string>(name);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const base64 = await toBase64(e.target.files[0]);
      if (base64) setValue(base64);
    }
  };

  return (
    <FieldItem {...{ error, touched }}>
      <input {...props} type="file" onChange={handleFile} id={field.name} />
    </FieldItem>
  );
}
