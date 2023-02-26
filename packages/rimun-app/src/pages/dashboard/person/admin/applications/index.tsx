import PersonApplicationList from "src/components/layout/list/PersonApplicationList";
import TabsMenu from "src/components/navigation/TabsMenu";
import PageTitle from "src/components/typography/PageTitle";
import SchoolApplicationList from "src/pages/dashboard/person/admin/applications/SchoolApplicationList";
import StatsOverview from "src/pages/dashboard/person/admin/applications/StatsOverview";

export default function AdminApplications() {
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
                  application: { requested_group: { name: "delegate" } },
                }}
              />
            ),
          },
          {
            name: "ICJ",
            component: () => (
              <PersonApplicationList
                filters={{ application: { requested_group: { name: "icj" } } }}
              />
            ),
          },
          {
            name: "Chairs",
            component: () => (
              <PersonApplicationList
                filters={{
                  application: { requested_group: { name: "chair" } },
                }}
              />
            ),
          },
          {
            name: "Staff",
            component: () => (
              <PersonApplicationList
                filters={{
                  application: { requested_group: { name: "staff" } },
                }}
              />
            ),
          },
          {
            name: "HSC",
            component: () => (
              <PersonApplicationList
                filters={{ application: { requested_group: { name: "hsc" } } }}
              />
            ),
          },
        ]}
      />
    </>
  );
}
