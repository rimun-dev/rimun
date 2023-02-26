import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import DropDown from "src/components/layout/DropDown";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Tag from "src/components/status/Tag";
import { SearchRouterOutputs, trpc } from "src/trpc";
import { getTagStatusFromHousing } from "src/utils/status";

interface HistoricalHousingRequestItemProps {
  personApplicationData: SearchRouterOutputs["searchPersons"]["result"][0];
  onUpdated: () => void;
}

export default function HistoricalHousingRequestItem(
  props: HistoricalHousingRequestItemProps
) {
  const [showRefuseModal, setShowRefuseModal] = React.useState(false);
  const [showAcceptModal, setShowAcceptModal] = React.useState(false);

  const mutation = trpc.applications.updatePersonApplication.useMutation({
    onSuccess: props.onUpdated,
  });

  return (
    <div className="grid grid-cols-5 gap-4 p-4 items-center">
      <PersonItemBadge
        className="col-span-2"
        person={props.personApplicationData.person}
        description={`${props.personApplicationData.university}, ${props.personApplicationData.city}`}
      />

      <div className="col-span-2">
        <Tag
          status={getTagStatusFromHousing(
            props.personApplicationData.status_housing
          )}
        />
      </div>

      <div className="col-span-1 flex items-center justify-end">
        <DropDown
          items={[
            { name: "Refuse", onClick: () => setShowRefuseModal(true) },
            { name: "Accept", onClick: () => setShowAcceptModal(true) },
          ]}
        >
          <CircularButton icon={EllipsisHorizontalIcon} />
        </DropDown>
      </div>

      <ConfirmationModal
        isVisible={showRefuseModal}
        setIsVisible={setShowRefuseModal}
        title="Refuse Housing Request"
        onConfirm={() =>
          mutation.mutate({
            person_id: props.personApplicationData.person.id,
            status_housing: "REFUSED",
          })
        }
      >
        Are you sure you want to refuse the housing request for{" "}
        <b>{props.personApplicationData.person.full_name}</b>?
      </ConfirmationModal>

      <ConfirmationModal
        isVisible={showAcceptModal}
        setIsVisible={setShowAcceptModal}
        title="Accept Housing Request"
        onConfirm={() =>
          mutation.mutate({
            person_id: props.personApplicationData.person.id,
            status_housing: "ACCEPTED",
          })
        }
      >
        Are you sure you want to accept the housing request for{" "}
        <b>{props.personApplicationData.person.full_name}</b>?
      </ConfirmationModal>
    </div>
  );
}
