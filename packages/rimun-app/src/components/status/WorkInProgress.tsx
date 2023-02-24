import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

interface WorkInProgressProps {}

const WorkInProgress: React.FC<WorkInProgressProps> = () => (
  <div className="flex flex-col justify-center items-center p-4 opacity-75">
    <ExclamationCircleIcon name="exclamation" className="h-8 w-8 mb-2" />
    <p>This section is still under development.</p>
  </div>
);

export default WorkInProgress;
