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

export function romanize(num: number): string {
  // https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
  if (isNaN(num)) return "NaN";
  var digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ],
    roman = "",
    i = 3;
  // @ts-ignore
  while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

export function renderGender(v?: string | null) {
  switch (v) {
    case "m":
      return "Male";
    case "f":
      return "Female";
    case "nb":
      return "Non-binary";
    default:
      return "Not selected";
  }
}

export function renderTshirtSize(v?: string | null) {
  switch (v) {
    case "s":
      return "Small";
    case "m":
      return "Medium";
    case "l":
      return "Large";
    default:
      return "Not selected";
  }
}
