import { PhoneIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link, LinkProps, useLocation } from "react-router-dom";

export interface NavBarLinkProps extends LinkProps {
  name: string;
  to: string;
  icon: typeof PhoneIcon;
  active?: boolean;
}

const NavBarLink: React.FC<NavBarLinkProps> = ({ active, ...props }) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const location = useLocation();

  const isSelected = location.pathname.includes(props.to);
  const isActive = active ?? true;

  const Icon = props.icon;

  return (
    <Link
      {...props}
      to={isActive ? props.to : "#"}
      key={props.name}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`block relative ${
        isSelected ? "text-blue-400" : "text-white"
      } h-full flex items-center w-16 gap-2 justify-center hover:opacity-75 transition-all`}
    >
      <Icon
        strokeWidth={1.5}
        className={`w-7 h-7 ${
          isActive ? "opacity-100" : "opacity-25"
        } flex-shrink-0`}
      />
      <p className="sm:hidden">{props.name}</p>

      <div
        className={`absolute ${
          isFocused ? "opacity-100" : "opacity-0"
        } transition-opacity top-full mt-2 text-center shadow-lg px-1 text-gray-900 text-xs rounded-sm bg-light border border-white border-opacity-5`}
      >
        {props.name}
      </div>
    </Link>
  );
};

export default NavBarLink;
