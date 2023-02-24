import React from "react";

type DropDownItem = {
  name: string;
  onClick: () => void | Promise<void>;
};

interface DropDownProps extends React.HTMLProps<HTMLDivElement> {
  items: DropDownItem[];
}

const DropDown: React.FC<DropDownProps> = (props) => {
  const [showDropdown, setShowDropdown] = React.useState<boolean>(false);
  return (
    <div {...props}>
      <div className="relative">
        <button
          type="button"
          className={`fixed top-0 left-0 w-screen h-screen opacity-0 z-30 cursor-default ${
            showDropdown ? undefined : "pointer-events-none"
          }`}
          onClick={() => setShowDropdown(false)}
        />

        <div onClick={() => setShowDropdown(true)}>{props.children}</div>

        <ul
          className={`flex flex-col top-8 mt-2 w-40 -left-32 shadow-lg absolute z-40 gap-4 p-4 bg-white border border-slate-200 rounded-lg ${
            showDropdown ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute -top-1.5 right-2 w-3 h-3 transform rotate-45 bg-white border-t border-l border-slate-200" />
          {props.items.map((item) => (
            <li key={item.name} className="text-xs">
              <button
                type="button"
                className="hover:text-blue-500 transition-colors"
                onClick={() => {
                  item.onClick();
                  setShowDropdown(false);
                }}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDown;
