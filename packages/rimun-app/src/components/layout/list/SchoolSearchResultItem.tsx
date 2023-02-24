import SchoolItemBadge from "src/components/layout/list/utils/SchoolItemBadge";
import { SearchRouterOutputs } from "src/trpc";

interface SchoolSearchResultItemProps {
  query?: string;
  school: SearchRouterOutputs["searchSchools"]["result"][0]["school"];
  onClick?: () => void;
}

export default function SchoolSearchResultItem(
  props: SchoolSearchResultItemProps
) {
  return (
    <button
      type="button"
      className="flex gap-4 items-center border border-slate-100 rounded-sm p-4 hover:bg-blue-50 w-full transition-colors text-left"
      onClick={props.onClick}
    >
      <SchoolItemBadge school={props.school} />
    </button>
  );
}
