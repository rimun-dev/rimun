import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "src/components/brand/Logo";
import CircularButton from "src/components/buttons/CircularButton";
import { useStateDispatch } from "src/store";
import { AuthActions } from "src/store/reducers/auth";
import { trpc } from "src/trpc";
import NavBarLink from "./NavBarLink";

export default function NavBarContainer(props: {
  children: React.ReactNode[];
}) {
  const [isMobileVisible, setIsMobileVisible] = React.useState(false);

  const dispatch = useStateDispatch();
  const location = useLocation();

  const trpcCtx = trpc.useContext();

  const handleLogout = () => {
    dispatch(AuthActions.logout());
    trpcCtx.invalidate();
  };

  React.useEffect(() => {
    setIsMobileVisible(false);
  }, [location]);

  return (
    <>
      <div
        className={`fixed sm:sticky w-screen sm:w-nav h-screen flex flex-col items-center z-30 bg-brand shadow-lg overflow-y-auto overflow-x-hidden transition-all duration-500 ${
          isMobileVisible ? "right-0" : "right-full"
        } sm:right-0`}
      >
        <div className="flex flex-col items-center gap-12 sm:gap-7 pb-6">
          <Link className="py-4" to="/">
            <Logo className="text-white w-10 h-10" />
          </Link>
          {props.children}
          <NavBarLink
            name="Logout"
            to="#"
            icon={ArrowLeftCircleIcon}
            onClick={handleLogout}
          />
        </div>
      </div>
      <CircularButton
        icon={isMobileVisible ? "x" : "bars-3"}
        className={`sm:hidden absolute top-4 right-4 w-10 h-10 z-50 shadow-md`}
        onClick={() => setIsMobileVisible(!isMobileVisible)}
      />
    </>
  );
}
