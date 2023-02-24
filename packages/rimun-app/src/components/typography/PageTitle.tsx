import React from "react";

interface PageTitleProps extends React.HTMLProps<HTMLHeadingElement> {}

export default function PageTitle(props: PageTitleProps) {
  return (
    <h1 {...props} className={`mb-4 font-bold text-2xl ${props.className}`} />
  );
}
