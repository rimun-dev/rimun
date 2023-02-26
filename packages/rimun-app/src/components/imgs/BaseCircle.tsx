import React from "react";

export default function BaseCircle(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`relative flex items-center justify-center rounded-full overflow-hidden bg-slate-200 w-12 h-12 flex-shrink-0 ${props.className}`}
    />
  );
}
