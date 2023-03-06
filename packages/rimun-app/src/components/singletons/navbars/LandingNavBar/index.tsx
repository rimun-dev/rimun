import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "src/components/brand/Logo";
import DropDown from "src/components/layout/DropDown";
import "./index.scss";

export default function LandingNavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState(false);

  const renderClassName = (name: string) =>
    location.pathname.includes(name) ? "selected" : undefined;

  React.useEffect(() => {
    return window.addEventListener("scroll", () => {
      document.body.scrollTop > 70 || document.documentElement.scrollTop > 70
        ? document.getElementById("navbar")?.classList.add("scrolled")
        : document.getElementById("navbar")?.classList.remove("scrolled");
    });
  }, []);

  return (
    <header
      id="navbar"
      className={location.pathname === "/" ? "home" : undefined}
    >
      <div id="nav-container" className="container">
        <div className="logo">
          <Link to="/">
            <Logo />
            <span>RIMUN</span>
          </Link>
        </div>

        <nav id="menu" className={isOpen ? "open" : undefined}>
          <ul>
            <li className={renderClassName("conference")}>
              <DropDown
                items={[
                  {
                    name: "Theme",
                    onClick: () => navigate("/conference/theme"),
                  },
                  {
                    name: "Forums",
                    onClick: () => navigate("/conference/forums/ga"),
                  },
                  {
                    name: "Our Team",
                    onClick: () => navigate("/conference/team"),
                  },
                  {
                    name: "Resources",
                    onClick: () => navigate("/conference/resources"),
                  },
                  {
                    name: "F.A.Q.",
                    onClick: () => navigate("/conference/faq"),
                  },
                ]}
              >
                <div className="flex gap-2 items-center">
                  <span>Conference</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </DropDown>
            </li>
            <li className={renderClassName("gallery")}>
              <Link to="/gallery">Gallery</Link>
            </li>
            <li className={renderClassName("blog")}>
              <Link to="/blog">Blog</Link>
            </li>
            <li className={renderClassName("blog")}>
              <Link to="/dashboard/news">Dashboard</Link>
            </li>
            <li className={renderClassName("contact")}>
              <Link to="/contact">Contact us</Link>
            </li>
          </ul>
        </nav>

        <div id="hamburger" className={isOpen ? "open" : undefined}>
          <button onClick={() => setIsOpen(!isOpen)}>
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
