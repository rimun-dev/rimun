import { useQuery } from "react-query";
import Rimun from "src/entities";
import { infoService } from "src/services";

type RoleInformation = { role: Rimun.Role; group: Rimun.Group };

type RolesInformation =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      roles: Rimun.Role[];
      groups: Rimun.Group[];
      describe: (rId: Rimun.Identifier) => RoleInformation;
      getGroupIdByName: (n: string) => Rimun.Identifier | undefined;
      getRoleIdByName: (gN: string, rN: string) => Rimun.Identifier | undefined;
    };

export default function useRolesInformation(): RolesInformation {
  const { data, isLoading } = useQuery(["info", "roles"], () => infoService.getRoles(), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  if (isLoading) return { isLoading: true };

  function describe(roleId: Rimun.Identifier): RoleInformation {
    const role = data!.data.roles.find((r) => r.id === roleId);
    const group = data!.data.groups.find((g) => g.id === role?.group_id);
    if (!role || !group) throw new Error(`Role identifier '${roleId}' does not match any role.`);
    return { role, group };
  }

  function getGroupIdByName(name: string): Rimun.Identifier | undefined {
    return data?.data.groups.find((d) => d.name === name)?.id;
  }

  function getRoleIdByName(groupName: string, roleName: string): Rimun.Identifier | undefined {
    const groupId = getGroupIdByName(groupName);
    return data?.data.roles.find((r) => r.name === roleName && r.group_id === groupId)?.id;
  }

  return {
    isLoading: false,
    roles: data ? data.data.roles : [],
    groups: data ? data.data.groups : [],
    describe,
    getGroupIdByName,
    getRoleIdByName,
  };
}
