import React from "react";
import { useMutation } from "react-query";
import CircularButton from "src/components/buttons/CircularButton";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import DropDown from "src/components/layout/DropDown";
import PersonItemBadge from "src/components/layout/list/utils/PersonItemBadge";
import Tag from "src/components/status/Tag";
import Rimun from "src/entities";
import { applicationsService } from "src/services";
import { getTagStatusFromHousing } from "src/utils/status";

interface HistoricalHousingRequestItemProps {
  person: Rimun.Person;
  application: Rimun.PersonApplication;
  onUpdated: (application: Rimun.PersonApplication) => void;
}

export default function HistoricalHousingRequestItem(props: HistoricalHousingRequestItemProps) {
  const [showRefuseModal, setShowRefuseModal] = React.useState(false);
  const [showAcceptModal, setShowAcceptModal] = React.useState(false);

  const mutation = useMutation(
    (data: { status_housing: Rimun.HousingStage }) => applicationsService.putPersonApplication(props.person.id, data),
    { onSuccess: (data) => props.onUpdated(data.data.application) }
  );

  return (
    <div className="grid grid-cols-5 gap-4 p-4 items-center">
      <PersonItemBadge
        {...props}
        className="col-span-2"
        description={`${props.application.university}, ${props.application.city}`}
      />

      <div className="col-span-2">
        <Tag status={getTagStatusFromHousing(props.application.status_housing)} />
      </div>

      <div className="col-span-1 flex items-center justify-end">
        <DropDown
          items={[
            { name: "Refuse", onClick: () => setShowRefuseModal(true) },
            { name: "Accept", onClick: () => setShowAcceptModal(true) },
          ]}
        >
          <CircularButton icon="dots-horizontal" />
        </DropDown>
      </div>

      <ConfirmationModal
        isVisible={showRefuseModal}
        setIsVisible={setShowRefuseModal}
        title="Refuse Housing Request"
        onConfirm={() => mutation.mutate({ status_housing: "refused" })}
      >
        Are you sure you want to refuse the housing request for{" "}
        <b>
          {props.person.name} {props.person.surname}
        </b>
        ?
      </ConfirmationModal>

      <ConfirmationModal
        isVisible={showAcceptModal}
        setIsVisible={setShowAcceptModal}
        title="Accept Housing Request"
        onConfirm={() => mutation.mutate({ status_housing: "accepted" })}
      >
        Are you sure you want to accept the housing request for{" "}
        <b>
          {props.person.name} {props.person.surname}
        </b>
        ?
      </ConfirmationModal>
    </div>
  );
}
