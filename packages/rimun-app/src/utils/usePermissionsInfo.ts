import { useQuery } from "react-query";
import Rimun from "src/entities";
import { infoService } from "src/services";

type PermissionsInformation =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      resources: Rimun.Resource[];
      getResourceIdByName: (name: string) => Rimun.Identifier | undefined;
    };

export default function usePermissionsInformation(): PermissionsInformation {
  const { data, isLoading } = useQuery(["info", "permissions"], () => infoService.getResources(), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  if (isLoading || !data) return { isLoading: true };

  function getResourceIdByName(name: string): Rimun.Identifier | undefined {
    return data?.data.find((r) => r.name === name)?.id;
  }

  return {
    isLoading: false,
    resources: data.data,
    getResourceIdByName,
  };
}
