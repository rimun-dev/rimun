import AvatarCircle from "src/components/imgs/AvatarCircle";
import SearchString from "src/components/text/SearchString";
import { DirectorsRouterOutputs, SearchRouterOutputs } from "src/trpc";

interface PersonSearchResultItemProps {
  query?: string;
  personData:
    | SearchRouterOutputs["searchPersons"]["result"][0]["person"]
    | DirectorsRouterOutputs["getAllDirectors"][0]["school"]["person_applications"][0]["person"]
    | SearchRouterOutputs["searchPersonsWithoutApplication"]["result"][0];
  onClick?: () => void;
}

export default function PersonSearchResultItem(
  props: PersonSearchResultItemProps
) {
  return (
    <button
      type="button"
      className="flex gap-4 items-center border border-slate-100 rounded-sm p-4 hover:bg-blue-50 w-full transition-colors text-left"
      onClick={props.onClick}
    >
      <AvatarCircle path={props.personData.picture_path} />
      <div>
        <p className="font-bold text-sm">
          <SearchString
            query={props.query ?? ""}
            target={props.personData.full_name}
          />
        </p>
      </div>
    </button>
  );
}
