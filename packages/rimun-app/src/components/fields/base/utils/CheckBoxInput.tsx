import React from "react";

interface CheckBoxInputProps extends React.HTMLProps<HTMLInputElement> {}

const CheckBoxInput: React.FC<CheckBoxInputProps> = (props) => (
  <input
    {...props}
    type="checkbox"
    className={`text-sm rounded-md bg-dark bg-opacity-40 border-0 focus:ring-inset focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-25 transition-shadow ${props.className}`}
  />
);

export default CheckBoxInput;
