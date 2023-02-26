import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useField } from "formik";
import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import CancelButton from "src/components/fields/base/CancelButton";
import toBase64 from "src/utils/toBase64";
import FieldItem from "../FieldItem";

interface MultipleImageFieldProps {
  name: string;
  label?: string;
  max?: number;
}

export interface ImageUpload {
  name: string;
  data: string;
}

export default function MultipleImageField({
  name,
  max = 25,
}: MultipleImageFieldProps) {
  const [{ value }, { error, touched }, { setValue }] =
    useField<ImageUpload[]>(name);

  const handlePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const newFiles: ImageUpload[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const name = file.name;
        const base64 = await toBase64(e.target.files[i]);
        if (base64) newFiles.push({ name, data: base64 });
      }
      setValue([...value, ...newFiles]);
    }
  };

  const handleRemove = (idx: number) => {
    if (!value || value.length === 0) return;

    if (idx === 0) {
      if (value.length === 1) setValue([]);
      else setValue([...value.slice(1)]);
    } else {
      const newValue = [
        ...value.slice(0, idx),
        ...value.slice(idx + 1, value.length),
      ];
      setValue(newValue);
    }
  };

  return (
    <>
      <div className="max-h-52 overflow-y-scroll">
        {value &&
          value.length > 0 &&
          value.map((img, idx) => (
            <div key={idx} className="flex items-center py-2 justify-between">
              <div className="flex items-center">
                <PhotoIcon className="opacity-50 w-8 h-8" />
                <div className="ml-2 line-clamp-1 overflow-ellipsis">
                  {img.name}
                </div>
              </div>
              <CircularButton
                icon={XMarkIcon}
                type="button"
                className="mr-2"
                onClick={() => handleRemove(idx)}
              />
            </div>
          ))}
      </div>

      {value.length < max && (
        <FieldItem {...{ error, touched }}>
          <input
            id={`${name}-multiple-file-input`}
            type="file"
            onChange={handlePicture}
            style={{ display: "none" }}
            multiple
          />

          <CancelButton
            className="border border-slate-300 border-dashed"
            onClick={() => {
              const input = document.getElementById(
                `${name}-multiple-file-input`
              );
              if (input) input.click();
            }}
          >
            Add Images
          </CancelButton>
        </FieldItem>
      )}
    </>
  );
}
