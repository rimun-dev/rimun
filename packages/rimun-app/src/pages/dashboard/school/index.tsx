import { Outlet } from "react-router-dom";
import DashboardContainer from "src/components/layout/DashboardContainer";

export default function SchoolDashboard() {
  return (
    <DashboardContainer>
      <Outlet />
    </DashboardContainer>
  );
}
