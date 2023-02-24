import React from "react";

interface BannerProps extends React.HTMLProps<HTMLDivElement> {
  status: "error" | "warn" | "info" | "success";
  title: string;
}

export default function Banner({ status, title, ...props }: BannerProps) {
  let borderColor = "border-blue-500";
  let bgColor = "bg-blue-200";
  switch (status) {
    case "error": {
      borderColor = "border-red-500";
      bgColor = "bg-red-200";
      break;
    }
    case "success": {
      borderColor = "border-red-500";
      bgColor = "bg-red-200";
      break;
    }
    case "warn": {
      borderColor = "border-orange-500";
      bgColor = "bg-orange-200";
      break;
    }
  }

  return (
    <div
      {...props}
      className={`relative border ${borderColor} ${bgColor} text-xs mt-4 rounded-lg ${props.className}`}
    >
      <div className="font-bold px-4 py-4 pb-2">{title}</div>
      <p className="px-4 pb-4">{props.children}</p>
    </div>
  );
}
