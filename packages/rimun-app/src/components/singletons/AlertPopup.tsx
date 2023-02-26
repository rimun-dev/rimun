import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useStateSelector } from "src/store";

const FADE_OUT_TIMEOUT_MS = 5000;

export default function AlertPopup() {
  const { displayAlertTimestamp, alert } = useStateSelector((s) => s.device);

  const [displayAlert, setDisplayAlert] = React.useState<boolean>(
    Date.now() - displayAlertTimestamp <= FADE_OUT_TIMEOUT_MS
  );

  let bgClass = "bg-green-500";
  let Icon = CheckCircleIcon;

  if (alert)
    switch (alert.status) {
      case "error":
        bgClass = "bg-red-500";
        Icon = XCircleIcon;
        break;
      case "warn":
        bgClass = "bg-orange-500";
        Icon = ExclamationCircleIcon;
        break;
      case "info":
        bgClass = "bg-blue-500";
        Icon = InformationCircleIcon;
        break;
    }

  React.useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - displayAlertTimestamp;
      setDisplayAlert(elapsed <= FADE_OUT_TIMEOUT_MS);
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [displayAlertTimestamp]);

  return (
    <div
      className={`fixed flex shadow-lg left-0 right-0 w-96 z-50 m-auto ${bgClass} ${
        !displayAlert || !alert
          ? "opacity-0 pointer-events-none -top-16"
          : "opacity-100 top-6"
      } transition-all text-white rounded-lg p-4`}
    >
      <Icon className="shrink-0 mr-2 h-6 w-6" />
      {alert && alert.message}
    </div>
  );
}
