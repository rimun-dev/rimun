import { useQuery } from "react-query";
import Rimun from "src/entities";
import { infoService } from "src/services";

export default function useCountryName(countryId: Rimun.Identifier) {
  const { data, isLoading } = useQuery(["info", "countries"], () => infoService.getCountries(), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  return { isLoading, name: data?.data.countries.find((c) => c.id === countryId)?.name };
}
