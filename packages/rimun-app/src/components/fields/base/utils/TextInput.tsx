import React from "react";

interface TextInputProps extends React.HTMLProps<HTMLInputElement> {}

const TextInput: React.FC<TextInputProps> = (props) => (
  <input
    type="text"
    {...props}
    className={`text-sm rounded-md bg-slate-100 border border-slate-200 bg-opacity-40 transition-shadow p-2 focus:outline-brand ${props.className}`}
  />
);

export default TextInput;
