import React from "react";

interface LabelProps extends React.HTMLProps<HTMLLabelElement> {}

const Label: React.FC<LabelProps> = (props) => {
  return (
    <label
      {...props}
      className={`text-xs text-slate-700 font-bold tracking-wide flex flex-col gap-2 ${props.className}`}
    >
      {props.children}
    </label>
  );
};

export default Label;
