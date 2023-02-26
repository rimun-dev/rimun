import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import CTAButton from "src/components/buttons/CTAButton";
import AddDirectorToSchoolModalForm from "src/components/forms/teachers/AddDirectorToSchoolModalForm";
import ConfirmationModal from "src/components/layout/ConfirmationModal";
import PersonList from "src/components/layout/list/PersonList";
import PageTitle from "src/components/typography/PageTitle";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";
import { SearchRouterInputs, trpc } from "src/trpc";
import useAuthenticatedState from "src/utils/useAuthenticatedState";

export default function SchoolTeachers() {
  const [showAddModal, setShowAddModal] = React.useState(false);

  const authState = useAuthenticatedState();
  const dispatch = useStateDispatch();

  const trpcCtx = trpc.useContext();

  const handleUpdate = () =>
    trpcCtx.search.searchPersons.invalidate({ filters });

  const filters: SearchRouterInputs["searchPersons"]["filters"] = {
    application: {
      school_id: authState.account.school!.id,
      confirmed_group: { name: "director" },
    },
  };

  const mutation = trpc.directors.removeDirector.useMutation({
    onSuccess: () => {
      handleUpdate();
      dispatch(
        DeviceActions.displayAlert({
          status: "success",
          message: "Teacher was deleted successfully.",
        })
      );
    },
  });

  return (
    <>
      <PageTitle>Teachers</PageTitle>
      <p className="mb-4">
        This section will let you add informations about those teachers that
        will be in Rome with the students during the conference. Please add all
        MUN Directors that will partecipate in the conference down below.
      </p>

      <CTAButton
        icon={PlusIcon}
        className="mb-4"
        onClick={() => setShowAddModal(true)}
      >
        Add Teacher
      </CTAButton>

      <PersonList
        filters={filters}
        modalComponent={(props) => (
          <ConfirmationModal
            {...props}
            title="Remove Teacher"
            onConfirm={() => mutation.mutate(props.person.id)}
          >
            Are you sure you want to remove{" "}
            <b>
              {props.person.name} {props.person.surname}
            </b>{" "}
            from the list of teachers?
          </ConfirmationModal>
        )}
      />

      <AddDirectorToSchoolModalForm
        isVisible={showAddModal}
        setIsVisible={setShowAddModal}
        onCreated={handleUpdate}
      />
    </>
  );
}
