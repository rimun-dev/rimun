import React from "react";

interface CancelButtonProps extends React.HTMLProps<HTMLButtonElement> {}

const CancelButton: React.FC<CancelButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      type="button"
      className={`hover:bg-opacity-75 text-sm font-semibold bg-slate-300 bg-opacity-40 rounded-md px-4 py-2 transition-all ${props.className}`}
    >
      {children}
    </button>
  );
};

export default CancelButton;
