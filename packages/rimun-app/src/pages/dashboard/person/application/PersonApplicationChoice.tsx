import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router-dom";
import CancelButton from "src/components/fields/base/CancelButton";
import SubmitButton from "src/components/fields/base/SubmitButton";
import ItemChoice from "src/components/navigation/ItemChoice";
import { useStateDispatch } from "src/store";
import { DeviceActions } from "src/store/reducers/device";

type ApplicationType = "high-school" | "undergraduate";

export default function PersonApplicationChoice() {
  const [type, setType] = React.useState<ApplicationType>();

  const navigate = useNavigate();
  const dispatch = useStateDispatch();

  return (
    <>
      <h1 className="text-2xl font-bold">What are you applying for?</h1>
      <p className="mt-2">Select one of the following options:</p>

      <ItemChoice
        onClick={() => setType("high-school")}
        checked={type === "high-school"}
      >
        I'm a <b>high-school</b> student and I want to attend RIMUN with my
        school as a delegate, chair, ICJ or staff.
      </ItemChoice>

      <ItemChoice
        onClick={() => setType("undergraduate")}
        checked={type === "undergraduate"}
      >
        I'm an <b>undergraduate</b> student and I want to attend RIMUN as a
        Historical Security Council delegate.
      </ItemChoice>

      <div className="flex mt-4 justify-between">
        <CancelButton
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowSmallLeftIcon className="mr-2" />
          Go back
        </CancelButton>

        <SubmitButton
          isLoading={false}
          onClick={() =>
            type === undefined
              ? dispatch(
                  DeviceActions.displayAlert({
                    status: "warn",
                    message: "Please select an option.",
                  })
                )
              : navigate(`/dashboard/application/${type}`)
          }
          className="flex items-center"
        >
          Continue
          <ArrowSmallRightIcon className="ml-2" />
        </SubmitButton>
      </div>
    </>
  );
}
