import EditAccountForm from "src/components/forms/settings/EditAccountForm";
import EditSchoolForm from "src/components/forms/settings/EditSchoolForm";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import { trpc } from "src/trpc";

export default function SchoolSettings() {
  const { data, isLoading } = trpc.profiles.getCurrentSchoolUser.useQuery();

  const trpcCtx = trpc.useContext();

  const handleUpdate = () => trpcCtx.profiles.getCurrentSchoolUser.invalidate();

  if (isLoading || !data) return <Spinner />;

  return (
    <div className="max-w-lg mx-auto">
      <PageTitle>School Information</PageTitle>

      <p className="mb-4">
        Here you can manage your school information and account credentials.
      </p>

      <EditAccountForm account={data.account} onUpdated={handleUpdate} />

      <div className="h-2" />

      <EditSchoolForm school={data} onUpdated={handleUpdate} />
    </div>
  );
}
