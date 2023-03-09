import { useParams } from "react-router-dom";
import FlagCircle from "src/components/imgs/FlagCircle";
import Card from "src/components/layout/Card";
import ApplicationTag from "src/components/status/ApplicationTag";
import HousingTag from "src/components/status/HousingTag";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import ProfileFeature from "src/pages/dashboard/person/admin/profiles/ProfileFeature";
import { trpc } from "src/trpc";

export default function AdminSchoolProfile() {
  const { id } = useParams();

  const { data, isLoading } = trpc.profiles.getSchoolProfile.useQuery(
    Number.parseInt(id!)
  );

  if (!data || isLoading) return <Spinner />;

  return (
    <div className="flex flex-col items-center">
      <FlagCircle country={data.country} className="w-32 h-32 mb-4" />
      <PageTitle className="text-center">{data.name}</PageTitle>

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
        <ProfileFeature name="Country">{data.country.name}</ProfileFeature>
        <ProfileFeature name="City">{data.city}</ProfileFeature>
        <ProfileFeature name="Address">
          {data.address_street}, {data.address_number}, {data.address_postal}
        </ProfileFeature>
      </Card>
    </div>
  );
}
