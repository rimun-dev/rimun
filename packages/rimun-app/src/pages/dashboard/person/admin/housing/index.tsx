import TabsMenu from "src/components/navigation/TabsMenu";
import PageTitle from "src/components/typography/PageTitle";
import HostList from "src/pages/dashboard/person/admin/housing/HostsList";
import HSCList from "src/pages/dashboard/person/admin/housing/HSCList";
import SchoolList from "src/pages/dashboard/person/admin/housing/SchoolList";
import StatsOverview from "src/pages/dashboard/person/admin/housing/StatsOverview";

export default function AdminHousing() {
  return (
    <>
      <PageTitle>Housing</PageTitle>
      <StatsOverview />
      <TabsMenu
        className="my-4"
        options={[
          { name: "Schools", component: SchoolList },
          { name: "Historical", component: HSCList },
          { name: "Hosts", component: HostList },
        ]}
      />
    </>
  );
}
