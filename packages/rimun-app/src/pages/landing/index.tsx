import { Outlet } from "react-router-dom";
import LandingFooter from "src/components/singletons/LandingFooter";
import LandingNavBar from "src/components/singletons/navbars/LandingNavBar";
import "./index.scss";

export default function Landing() {
  return (
    <div id="landing" className="relative">
      <LandingNavBar />
      <div className="main">
        <Outlet />
      </div>
      <LandingFooter />
    </div>
  );
}
