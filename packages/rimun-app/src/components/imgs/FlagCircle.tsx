import React from "react";
import BaseCircle from "src/components/imgs/BaseCircle";
import { InfoRouterOutputs } from "src/trpc";
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface FlagCircleProps extends React.HTMLProps<HTMLDivElement> {
  country: InfoRouterOutputs["getCountries"][0];
}

export default function FlagCircle({ country, ...props }: FlagCircleProps) {
  return (
    <BaseCircle {...props} className={`border ${props.className}`}>
      <div
        className={`fib fi-${country?.code.toLowerCase()} fis w-full h-full bg-contain bg-no-repeat`}
        style={{ backgroundPosition: "50%" }}
      />
    </BaseCircle>
  );
}
