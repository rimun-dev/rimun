import React from "react";

interface CardProps extends React.HTMLProps<HTMLDivElement> {}

export default function Card(props: CardProps) {
  return (
    <div
      {...props}
      className={`bg-white border border-slate-200 rounded-md shadow-sm ${props.className}`}
    />
  );
}
