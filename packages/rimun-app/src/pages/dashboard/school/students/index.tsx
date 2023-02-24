import PersonApplicationList from "src/components/layout/list/PersonApplicationList";
import TabsMenu from "src/components/navigation/TabsMenu";
import PageTitle from "src/components/typography/PageTitle";
import useAuthenticatedState from "src/utils/useAuthenticatedState";

export default function SchoolStudents() {
  const authState = useAuthenticatedState();

  return (
    <>
      <PageTitle>Students</PageTitle>
      <p className="mb-4">
        In this section you will be able to keep track of your students
        applications. You will also be able to accept/refuse applications from
        delegates, students that applied for other roles will be directly chosen
        by the Secretariat (their status will be visible in this section).
      </p>

      <TabsMenu
        className="my-4"
        options={[
          {
            name: "Delegates",
            component: () => (
              <PersonApplicationList
                filters={{
                  school_id: authState.account.school!.id,
                  requested_group: { name: "delegate" }!,
                }}
              />
            ),
          },
          {
            name: "ICJ",
            component: () => (
              <PersonApplicationList
                filters={{
                  school_id: authState.account.school!.id,
                  requested_group: { name: "icj" }!,
                }}
              />
            ),
          },
          {
            name: "Chairs",
            component: () => (
              <PersonApplicationList
                filters={{
                  school_id: authState.account.school!.id,
                  requested_group: { name: "chair" }!,
                }}
              />
            ),
          },
          {
            name: "Staff",
            component: () => (
              <PersonApplicationList
                filters={{
                  school_id: authState.account.school!.id,
                  requested_group: { name: "staff" }!,
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
}
