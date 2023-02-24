import React from "react";
import Icon, { IconName } from "../icons/Icon";

interface CTAButtonProps extends React.HTMLProps<HTMLButtonElement> {
  icon?: IconName;
}

const CTAButton: React.FC<CTAButtonProps> = ({ icon, children, ...props }) => {
  return (
    <button
      {...props}
      type="button"
      className={`flex items-center justify-center px-4 py-3 transition-all hover:bg-opacity-75 text-sm text-white font-semibold bg-brand bg-opacity-100 rounded-lg ${props.className}`}
    >
      <span>{children}</span>
      {icon && <Icon name={icon} className="ml-2" />}
    </button>
  );
};

export default CTAButton;
