import { PhoneIcon } from "@heroicons/react/24/outline";
import React from "react";

interface CTAButtonProps extends React.HTMLProps<HTMLButtonElement> {
  icon?: typeof PhoneIcon;
}

const CTAButton: React.FC<CTAButtonProps> = ({ icon, children, ...props }) => {
  const Icon = icon;
  return (
    <button
      {...props}
      type="button"
      className={`flex items-center justify-center px-4 py-3 transition-all hover:bg-opacity-75 text-sm text-white font-semibold bg-brand bg-opacity-100 rounded-lg ${props.className}`}
    >
      <span>{children}</span>
      {!!Icon && <Icon className="ml-2 w-4 h-4" />}
    </button>
  );
};

export default CTAButton;
