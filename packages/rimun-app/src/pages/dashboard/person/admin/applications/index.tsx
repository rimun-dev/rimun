import PersonApplicationList from "src/components/layout/list/PersonApplicationList";
import TabsMenu from "src/components/navigation/TabsMenu";
import Spinner from "src/components/status/Spinner";
import PageTitle from "src/components/typography/PageTitle";
import SchoolApplicationList from "src/pages/dashboard/person/admin/applications/SchoolApplicationList";
import StatsOverview from "src/pages/dashboard/person/admin/applications/StatsOverview";
import useRolesInformation from "src/utils/useRolesInformation";

export default function AdminApplications() {
  const rolesInfo = useRolesInformation();

  if (rolesInfo.isLoading) return <Spinner />;

  return (
    <>
      <PageTitle>Applications</PageTitle>
      <StatsOverview />
      <TabsMenu
        className="my-4"
        options={[
          { name: "Schools", component: SchoolApplicationList },
          {
            name: "Delegates",
            component: () => (
              <PersonApplicationList
                filters={{
                  requested_group_id: rolesInfo.getGroupIdByName("delegate")!,
                }}
              />
            ),
          },
          {
            name: "ICJ",
            component: () => (
              <PersonApplicationList
                filters={{
                  requested_group_id: rolesInfo.getGroupIdByName("icj")!,
                }}
              />
            ),
          },
          {
            name: "Chairs",
            component: () => (
              <PersonApplicationList
                filters={{
                  requested_group_id: rolesInfo.getGroupIdByName("chair")!,
                }}
              />
            ),
          },
          {
            name: "Staff",
            component: () => (
              <PersonApplicationList
                filters={{
                  requested_group_id: rolesInfo.getGroupIdByName("staff")!,
                }}
              />
            ),
          },
          {
            name: "HSC",
            component: () => (
              <PersonApplicationList
                filters={{
                  requested_group_id: rolesInfo.getGroupIdByName("hsc")!,
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
}
