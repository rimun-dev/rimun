import { Outlet } from "react-router-dom";
import DashboardContainer from "src/components/layout/DashboardContainer";

export default function PersonDashboard() {
  return (
    <DashboardContainer>
      <Outlet />
    </DashboardContainer>
  );
}
