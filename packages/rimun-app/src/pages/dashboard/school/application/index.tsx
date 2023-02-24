import Spinner from "src/components/status/Spinner";
import SchoolApplicationAction from "src/pages/dashboard/school/application/SchoolApplicationAction";
import SchoolApplicationOverview from "src/pages/dashboard/school/application/SchoolApplicationOverview";
import { trpc } from "src/trpc";

export default function SchoolApplication() {
  const { data, isLoading } = trpc.profiles.getCurrentSchoolUser.useQuery();

  if (isLoading || !data) return <Spinner />;

  return (
    <div className="flex justify-center bg-slate-100">
      <div className="max-w-xl w-full p-4 shadow-lg border-slate-200 border bg-light rounded-lg">
        {data.applications.length === 0 ? (
          <SchoolApplicationAction />
        ) : (
          <SchoolApplicationOverview schoolData={data} />
        )}
      </div>
    </div>
  );
}
