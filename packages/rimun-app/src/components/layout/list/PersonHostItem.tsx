import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import AddGuestModalForm from "src/components/forms/housing/AddGuestModalForm";
import DelGuestModalForm from "src/components/forms/housing/DelGuestModalForm";
import DropDown from "src/components/layout/DropDown";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import { SearchRouterOutputs } from "src/trpc";
import { renderHousingAddress } from "src/utils/strings";

interface PersonHostItemProps {
  hostApplicationData: SearchRouterOutputs["searchPersons"]["result"][0];
  onUpdate: () => void;
}

export default function PersonHostItem(props: PersonHostItemProps) {
  const [showAddMatchModal, setShowAddMatchModal] = React.useState(false);
  const [showDelMatchModal, setShowDelMatchModal] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  function HostFeature({
    icon,
    value,
    condition,
  }: {
    icon: typeof PhoneIcon;
    value?: string | null;
    condition?: boolean;
  }) {
    const Icon = icon;
    return (
      <div className="flex gap-2 items-center">
        <Icon className="text-xs text-slate-500 w-4 h-4" />
        <p>{condition || value ? value : "N/A"}</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      <div className="grid grid-cols-5 gap-4 items-center p-4">
        <PersonItemBadge
          className="col-span-2"
          person={props.hostApplicationData.person}
          description={
            props.hostApplicationData.school
              ? `${props.hostApplicationData.school.name}, ${props.hostApplicationData.school_year}${props.hostApplicationData.school_section}`
              : "No School Information"
          }
        />

        <div className="col-span-2 font-mono">
          {props.hostApplicationData.person.host_matches.length}/
          {props.hostApplicationData.housing_n_guests}
        </div>

        <div className="col-span-1 flex items-center justify-end gap-2">
          <DropDown
            items={[
              { name: "Add Guest", onClick: () => setShowAddMatchModal(true) },
              {
                name: "Remove Guest",
                onClick: () => setShowDelMatchModal(true),
              },
            ]}
          >
            <CircularButton icon={EllipsisHorizontalIcon} />
          </DropDown>
          <CircularButton
            icon={ChevronDownIcon}
            className={`transition-transform ${
              showDetails ? "rotate-180" : undefined
            }`}
            onClick={() => setShowDetails(!showDetails)}
          />
        </div>
      </div>

      {showDetails && (
        <div className="flex p-4 ">
          <div className="text-xs flex flex-col gap-2 md:w-2/5 ">
            <HostFeature
              icon={MapPinIcon}
              condition={!!props.hostApplicationData.housing_address_street}
              value={renderHousingAddress(props.hostApplicationData)}
            />
            <HostFeature
              icon={PhoneIcon}
              value={props.hostApplicationData.housing_phone_number}
            />
            <HostFeature
              icon={HeartIcon}
              value={props.hostApplicationData.housing_pets}
            />
            <HostFeature
              icon={UserIcon}
              value={props.hostApplicationData.housing_gender_preference}
            />
          </div>

          <div className="text-xs flex flex-col gap-2">
            <p className="font-bold text-xs text-slate-500">Guests</p>
            {props.hostApplicationData.person.host_matches.length === 0 &&
              "No guests yet."}
            {props.hostApplicationData.person.host_matches.map((match) => (
              <PersonItemBadge person={match.guest} format="small" />
            ))}
          </div>
        </div>
      )}

      <AddGuestModalForm
        isVisible={showAddMatchModal}
        setIsVisible={setShowAddMatchModal}
        host={props.hostApplicationData.person}
        onUpdate={props.onUpdate}
      />
      <DelGuestModalForm
        isVisible={showDelMatchModal}
        setIsVisible={setShowDelMatchModal}
        hostApplicationData={props.hostApplicationData}
        onUpdate={props.onUpdate}
      />
    </div>
  );
}
