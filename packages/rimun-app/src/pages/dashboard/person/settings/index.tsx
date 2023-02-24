import EditAccountForm from "src/components/forms/settings/EditAccountForm";
import EditPersonForm from "src/components/forms/settings/EditPersonForm";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import ProfilePicture from "src/pages/dashboard/person/settings/ProfilePicture";
import { trpc } from "src/trpc";

export default function PersonSettings() {
  const { data, isLoading } = trpc.profiles.getCurrentPersonUser.useQuery();

  const trpcCtx = trpc.useContext();

  const handleUpdate = () => trpcCtx.profiles.getCurrentPersonUser.invalidate();

  if (isLoading || !data) return <Spinner />;

  return (
    <div className="max-w-lg mx-auto">
      <PageTitle>Personal Information</PageTitle>

      <p className="mb-4">
        Here you can manage your personal data and account credentials.
      </p>

      <ProfilePicture personData={data} />

      <div className="h-2" />

      <EditAccountForm account={data.account} onUpdated={handleUpdate} />

      <div className="h-2" />

      <EditPersonForm person={data} onUpdated={handleUpdate} />
    </div>
  );
}
