import AvatarCircle from "src/components/imgs/AvatarCircle";
import SearchString from "src/components/text/SearchString";
import { DirectorsRouterOutputs, SearchRouterOutputs } from "src/trpc";

interface PersonSearchResultItemProps {
  query?: string;
  personApplicationData:
    | SearchRouterOutputs["searchPersons"]["result"][0]
    | DirectorsRouterOutputs["getAllDirectors"][0]["school"]["person_applications"][0];
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
      <AvatarCircle path={props.personApplicationData.person.picture_path} />
      <div>
        <p className="font-bold text-sm">
          <SearchString
            query={props.query ?? ""}
            target={props.personApplicationData.person.full_name}
          />
        </p>
        <p className="font-light text-xs">
          {props.personApplicationData.person.account
            ? props.personApplicationData.person.account?.email
            : props.personApplicationData.person.phone_number}
        </p>
      </div>
    </button>
  );
}
