import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SubmitButton from "src/components/buttons/SubmitButton";
import CancelButton from "src/components/fields/base/CancelButton";
import ItemChoice from "src/components/navigation/ItemChoice";
import { DeviceActions } from "src/store/reducers/device";

type RegistrationType = "person" | "school";

export default function Registration() {
  const [type, setType] = React.useState<RegistrationType>();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-100">
      <div className="max-w-lg w-full p-4 shadow-lg border-slate-200 border bg-light rounded-lg">
        <h1 className="text-2xl font-bold">Tell us about you</h1>
        <p className="mt-2">Select one of the following options:</p>

        <ItemChoice
          onClick={() => setType("person")}
          checked={type === "person"}
        >
          I am a <b>student</b> who wants to take part in the conference.
        </ItemChoice>

        <ItemChoice
          onClick={() => setType("school")}
          checked={type === "school"}
        >
          I represent a <b>school/organization</b> and I want to bring my
          students to the conference.
          <span className="block text-xs opacity-50 mt-1">
            Please note that this is not intended to be a personal account
          </span>
        </ItemChoice>

        <div className="flex mt-4 justify-between">
          <CancelButton
            onClick={() => navigate("/login")}
            className="flex items-center"
          >
            Go back
          </CancelButton>

          <SubmitButton
            isLoading={false}
            onClick={() =>
              !type
                ? dispatch(
                    DeviceActions.displayAlert({
                      status: "warn",
                      message: "Please select an option.",
                    })
                  )
                : navigate(`/registration/${type}`)
            }
            className="flex items-center"
          >
            Continue
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}
