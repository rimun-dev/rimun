import { useParams } from "react-router-dom";
import AvatarCircle from "src/components/imgs/AvatarCircle";
import Card from "src/components/layout/Card";
import ApplicationTag from "src/components/status/ApplicationTag";
import HousingTag from "src/components/status/HousingTag";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import ProfileFeature from "src/pages/dashboard/person/admin/profiles/ProfileFeature";
import { trpc } from "src/trpc";
import { renderGender, renderTshirtSize } from "src/utils/strings";

export default function AdminPersonProfile() {
  const { id } = useParams();

  const { data, isLoading } = trpc.profiles.getPersonProfile.useQuery(
    Number.parseInt(id!)
  );

  if (!data || isLoading) return <Spinner />;

  return (
    <div className="flex flex-col items-center">
      <AvatarCircle path={data.picture_path} className="w-32 h-32 mb-4" />
      <PageTitle className="text-center">{data.full_name}</PageTitle>
      <p className="-mt-4">
        {data.applications[0].confirmed_role?.name ?? "No assigned role yet"}
      </p>

      <Card className="grid w-96 items-center mt-4 divide-y">
        <ProfileFeature name="Status">
          <ApplicationTag>
            {data.applications[0].status_application}
          </ApplicationTag>
        </ProfileFeature>
        <ProfileFeature name="Housing">
          <HousingTag>{data.applications[0].status_housing}</HousingTag>
        </ProfileFeature>
        <ProfileFeature name="Email">{data.account?.email}</ProfileFeature>
        <ProfileFeature name="Phone">{data.phone_number}</ProfileFeature>
        <ProfileFeature name="Nationality">{data.country.name}</ProfileFeature>
        <ProfileFeature name="Gender">
          {renderGender(data.gender)}
        </ProfileFeature>
        <ProfileFeature name="Birthday">
          {data.birthday ? new Date(data.birthday).toLocaleDateString() : null}
        </ProfileFeature>
        <ProfileFeature name="Allergies">{data.allergies}</ProfileFeature>
        <ProfileFeature name="T-Shirt">
          {renderTshirtSize(data.tshirt_size)}
        </ProfileFeature>
      </Card>
    </div>
  );
}
