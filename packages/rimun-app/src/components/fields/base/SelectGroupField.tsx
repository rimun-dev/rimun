import SelectField, {
  SelectFieldProps,
} from "src/components/fields/base/SelectField";
import Spinner from "src/components/status/Spinner";
import { trpc } from "src/trpc";

interface SelectGroupFieldProps extends Omit<SelectFieldProps, "options"> {
  groupName?: string;
}

export default function SelectGroupField(props: SelectGroupFieldProps) {
  const groupsQuery = trpc.info.getGroups.useQuery(undefined, {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (groupsQuery.isLoading || !groupsQuery.data) return <Spinner />;

  return (
    <SelectField
      {...props}
      options={groupsQuery.data.map((r) => ({
        name: r.name,
        value: r.id,
      }))}
    />
  );
}
