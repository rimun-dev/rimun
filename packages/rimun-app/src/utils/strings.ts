import Rimun from "src/entities";
import useCountryName from "src/utils/useCountryName";

export function renderHousingAddress(application: Rimun.PersonApplication): string {
  return `${application.housing_address_street}, ${application.housing_address_number}, ${application.housing_address_postal}`;
}

export function useDelegationName(delegation: Rimun.Delegation): { isLoading: boolean; name: string | undefined } {
  const countryNameInfo = useCountryName(delegation.country_id ?? -1);
  if (delegation.type !== "country") return { isLoading: false, name: delegation.name };
  if (!delegation.country_id) return { isLoading: false, name: "[Error: missing delegation country]" };
  return countryNameInfo;
}
