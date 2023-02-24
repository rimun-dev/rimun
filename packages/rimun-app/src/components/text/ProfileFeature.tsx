import React from "react";

interface ProfileFeatureProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
}

const ProfileFeature: React.FC<ProfileFeatureProps> = ({
  name,
  children,
  ...props
}) => (
  <div {...props}>
    <span className="block">{children}</span>
    <span className="block text-xs font-bold uppercase tracking-wider text-white text-opacity-25 mt-1">
      {name}
    </span>
  </div>
);

export default ProfileFeature;
