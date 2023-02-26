import SelectField, {
  SelectFieldProps,
} from "src/components/fields/base/SelectField";
import Spinner from "src/components/status/Spinner";
import { InfoRouterOutputs, trpc } from "src/trpc";

interface SelectRoleFieldProps extends Omit<SelectFieldProps, "options"> {
  groupName?: string;
  groupId?: InfoRouterOutputs["getGroups"][0]["id"];
}

export default function SelectRoleField({
  groupName,
  groupId,
  ...props
}: SelectRoleFieldProps) {
  const rolesQuery = trpc.info.getRoles.useQuery(
    { group: { name: groupName, id: groupId } },
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  if (rolesQuery.isLoading || !rolesQuery.data) return <Spinner />;

  return (
    <SelectField
      {...props}
      options={rolesQuery.data.map((r) => ({
        name: r.name,
        value: r.id,
      }))}
    />
  );
}
