import { SearchRouterOutputs } from "src/trpc";

export function getTagStatusFromApplication(
  status:
    | SearchRouterOutputs["searchPersons"]["result"][0]["status_application"]
    | SearchRouterOutputs["searchSchools"]["result"][0]["status_application"]
) {
  switch (status) {
    case "ACCEPTED":
      return "success";
    case "HOLD":
      return "warn";
    case "REFUSED":
      return "error";
  }
}

export function getTagStatusFromHousing(
  status:
    | SearchRouterOutputs["searchPersons"]["result"][0]["status_housing"]
    | SearchRouterOutputs["searchSchools"]["result"][0]["status_housing"]
) {
  switch (status) {
    case "ACCEPTED":
      return "success";
    case "HOLD":
      return "warn";
    case "REFUSED":
      return "error";
    case "NOT_REQUIRED":
      return "info";
  }
}
