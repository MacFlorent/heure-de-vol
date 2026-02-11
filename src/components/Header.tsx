import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";
import ActiveLogbookPanel from "./ActiveLogbookPanel";

// ============================================================================
// Header
export default function Header() {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">

          <nav className="flex items-center space-x-1">
            <Link to={ROUTES.HOME} className="py-4 px-2 text-gray-500 hover:text-blue-500">Dashboard</Link>
            <Link to={ROUTES.NEW_FLIGHT} className="py-4 px-2 text-gray-500 hover:text-blue-500">New Flight</Link>
          </nav>

          <div className="flex items-center space-x-4 py-4">
            <ActiveLogbookPanel />
            <span className="font-semibold text-gray-500 text-lg">HeureDeVol</span>
          </div>

        </div>
      </div>
    </header>
  );
}