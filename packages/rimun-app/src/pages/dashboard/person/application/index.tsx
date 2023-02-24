import { Outlet } from "react-router-dom";
import Spinner from "src/components/status/Spinner";
import PersonApplicationOverview from "src/pages/dashboard/person/application/PersonApplicationOverview";
import { trpc } from "src/trpc";

export default function PersonApplication() {
  const { data, isLoading } = trpc.profiles.getCurrentPersonUser.useQuery();

  if (isLoading || !data) return <Spinner />;

  return (
    <div className="flex justify-center bg-slate-100">
      <div className="max-w-xl w-full p-4 shadow-lg border-slate-200 border bg-light rounded-lg">
        {data.applications.length === 0 ? (
          <Outlet />
        ) : (
          <PersonApplicationOverview personData={data} />
        )}
      </div>
    </div>
  );
}
