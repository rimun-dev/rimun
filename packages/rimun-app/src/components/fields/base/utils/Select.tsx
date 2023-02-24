import React from "react";

interface SelectProps extends React.HTMLProps<HTMLSelectElement> {}

const Select: React.FC<SelectProps> = (props) => {
  return (
    <select
      {...props}
      className={`text-sm rounded-md bg-slate-100 border border-slate-200 bg-opacity-40 transition-shadow p-2 focus:outline-brand ${props.className}`}
    />
  );
};

export default Select;
