import flags from "country-flag-icons/react/1x1";
import React from "react";
import BaseCircle from "src/components/imgs/BaseCircle";
import { InfoRouterOutputs } from "src/trpc";

interface FlagCircleProps extends React.HTMLProps<HTMLDivElement> {
  country: InfoRouterOutputs["getCountries"][0];
}

export default function FlagCircle({ country, ...props }: FlagCircleProps) {
  const code = country.code.toUpperCase();
  if (!(code in flags))
    return <BaseCircle {...props} className={`border ${props.className}`} />;
  // @ts-ignore
  const Flag = flags[code];
  return (
    <BaseCircle {...props} className={`border ${props.className}`}>
      <Flag />
    </BaseCircle>
  );
}
