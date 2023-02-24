import { useField } from "formik";
import React from "react";
import toBase64 from "src/utils/toBase64";
import FieldItem from "../FieldItem";

interface ImagePreviewFieldProps {
  name: string;
}

const ImagePreviewField: React.FC<ImagePreviewFieldProps> = ({ name }) => {
  const [{ value }, { error, touched }, { setValue }] = useField<string>(name);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const base64 = await toBase64(e.target.files[0]);
      if (base64) setValue(base64);
    }
  };

  return (
    <FieldItem {...{ error, touched }}>
      {value ? (
        <img src={value} alt={`${name} preview`} className="w-36 h-36 rounded-lg object-cover bg-slate-200" />
      ) : (
        <div className="w-36 h-36 rounded-lg bg-slate-200" />
      )}

      <input id={`${name}-file-input`} type="file" onChange={handleFile} />
    </FieldItem>
  );
};

export default ImagePreviewField;
