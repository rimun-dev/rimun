import React from "react";
import Spinner from "src/components/status/Spinner";

interface SubmitButtonProps extends React.HTMLProps<HTMLButtonElement> {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, children, ...props }) => {
  return (
    <button
      {...props}
      type="submit"
      className={`hover:bg-opacity-75 text-white text-sm font-semibold bg-brand ${
        props.disabled ? "bg-opacity-25" : "bg-opacity-100"
      } rounded-md px-4 py-2 transition-all ${props.className}`}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default SubmitButton;
