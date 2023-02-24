import React from "react";
import useAuthenticatedState from "src/utils/useAuthenticatedState";
import PersonNavBar from "../singletons/navbars/PersonNavBar";
import SchoolNavBar from "../singletons/navbars/SchoolNavBar";

export default function DashboardContainer(
  props: React.HTMLProps<HTMLDivElement>
) {
  const authState = useAuthenticatedState();
  return (
    <div {...props} className="flex min-h-screen bg-slate-100">
      {!authState.account.is_school ? <PersonNavBar /> : <SchoolNavBar />}
      <div className="px-4 container sm:px-10 py-8 w-full sm:max-w-screen-lg sm:mx-auto max-h-screen overflow-y-auto">
        {props.children}
      </div>
    </div>
  );
}
