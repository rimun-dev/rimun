import React from "react";
import CircularButton from "src/components/buttons/CircularButton";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import DropDown from "src/components/layout/DropDown";
import SchoolItemBadge from "src/components/layout/list/utils/SchoolItemBadge";
import Tag from "src/components/status/Tag";
import { SearchRouterOutputs, trpc } from "src/trpc";
import { getTagStatusFromHousing } from "src/utils/status";

interface SchoolHousingRequestItemProps {
  schoolApplicationData: SearchRouterOutputs["searchSchools"]["result"][0];
  onUpdated: () => void;
}

export default function SchoolHousingRequestItem(
  props: SchoolHousingRequestItemProps
) {
  const [showRefuseModal, setShowRefuseModal] = React.useState(false);
  const [showAcceptModal, setShowAcceptModal] = React.useState(false);

  const mutation = trpc.applications.updateSchoolApplication.useMutation({
    onSuccess: props.onUpdated,
  });

  let nStudents = 0;
  for (let assignment of props.schoolApplicationData.school
    .school_group_assignments)
    nStudents += assignment.n_confirmed ?? 0;

  return (
    <div className="grid grid-cols-6 items-center p-4">
      <SchoolItemBadge
        className="col-span-3"
        school={props.schoolApplicationData.school}
      />

      <div className="col-span-1">
        <Tag
          status={getTagStatusFromHousing(
            props.schoolApplicationData.status_housing
          )}
        >
          {props.schoolApplicationData.status_housing}
        </Tag>
      </div>

      <div className="col-span-1 font-mono">{nStudents}</div>

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
        onConfirm={() =>
          mutation.mutate({
            school_id: props.schoolApplicationData.school.id,
            status_housing: "REFUSED",
          })
        }
      >
        Are you sure you want to refuse the housing request for{" "}
        <b>{props.schoolApplicationData.school.name}</b>?
      </ConfirmationModal>

      <ConfirmationModal
        isVisible={showAcceptModal}
        setIsVisible={setShowAcceptModal}
        title="Accept Housing Request"
        onConfirm={() =>
          mutation.mutate({
            school_id: props.schoolApplicationData.school.id,
            status_housing: "ACCEPTED",
          })
        }
      >
        Are you sure you want to accept the housing request for{" "}
        <b>{props.schoolApplicationData.school.name}</b>?
      </ConfirmationModal>
    </div>
  );
}
