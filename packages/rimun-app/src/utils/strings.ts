import {
  CommitteesRouterOutputs,
  DelegationsRouterOutputs,
  SearchRouterOutputs,
} from "src/trpc";

export function renderHousingAddress(
  application: SearchRouterOutputs["searchPersons"]["result"][0]
): string {
  return `${application.housing_address_street}, ${application.housing_address_number}, ${application.housing_address_postal}`;
}

export function renderDelegationName(
  delegation:
    | DelegationsRouterOutputs["getDelegations"][0]
    | CommitteesRouterOutputs["getCommittee"]["person_applications"][0]["delegation"]
    | DelegationsRouterOutputs["getDelegation"]
) {
  if (!delegation) return undefined;
  return delegation.type !== "country"
    ? delegation.name
    : delegation.country!.name;
}
