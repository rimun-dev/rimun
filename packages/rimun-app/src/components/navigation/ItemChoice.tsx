import React from "react";
import CheckBoxInput from "../fields/base/utils/CheckBoxInput";

interface ItemChoiceProps extends React.HTMLProps<HTMLButtonElement> {
  checked: boolean;
}

const ItemChoice: React.FC<ItemChoiceProps> = ({ checked, ...props }) => (
  <button
    {...props}
    type="button"
    className={`flex transition-colors bg-slate-50 items-center text-left w-full mt-4 justify-between p-4 rounded-lg border text-sm ${
      checked ? "border-brand" : "border-slate-200"
    }`}
  >
    <p className="block w-5/6">{props.children}</p>
    <CheckBoxInput onChange={() => {}} checked={checked} />
  </button>
);

export default ItemChoice;
