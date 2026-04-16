import { memo } from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import { ROUTES } from "@/constants";
import ActiveLogbookPanel from "./ActiveLogbookPanel";

// ============================================================================
// HeaderLink
const HeaderLink = memo((props: NavLinkProps) => {
  return (
    <NavLink
      className={({ isActive }) => isActive ? "py-4 px-2 text-primary-500 font-bold" : "py-4 px-2 text-neutral-500 hover:text-primary-500"}
      {...props}
    />
  );
});

HeaderLink.displayName = "HeaderLink";

// ============================================================================
// Header
export default function Header() {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">

          <nav className="flex items-center space-x-1">
            <HeaderLink to={ROUTES.HOME}>Dashboard</HeaderLink>
            <HeaderLink to={ROUTES.LOGBOOKS}>Logbooks</HeaderLink>
            <HeaderLink to={ROUTES.FLIGHTS}>Flights</HeaderLink>
          </nav>

          <div className="flex items-center space-x-4 py-4">
            <ActiveLogbookPanel />
            <span className="font-semibold text-neutral-700 text-lg">| HeureDeVol</span>
          </div>

        </div>
      </div>
    </header>
  );
}