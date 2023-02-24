import React from "react";

interface TabsMenuProps extends React.HTMLProps<HTMLDivElement> {
  options: {
    name: string;
    component: () => JSX.Element | null;
  }[];
}

export default function TabsMenu(props: TabsMenuProps) {
  const [activeTab, setActiveTab] = React.useState(
    props.options.length > 0 ? props.options[0].name : undefined
  );
  const Content =
    props.options.find((o) => o.name === activeTab)?.component ?? (() => <></>);
  return (
    <>
      <div
        {...props}
        className={`flex gap-4 max-w-full overflow-x-auto ${props.className}`}
      >
        {props.options.map((o) => (
          <button
            key={o.name}
            type="button"
            onClick={() => setActiveTab(o.name)}
            className={`py-2 px-4 transition-colors rounded-md text-sm ${
              activeTab === o.name ? "bg-indigo-200" : "hover:bg-indigo-100"
            }`}
          >
            {o.name}
          </button>
        ))}
      </div>
      <Content />
    </>
  );
}
