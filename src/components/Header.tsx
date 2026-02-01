import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";

// ============================================================================
// Header
export default function Header() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div className="flex items-center py-4">
              <span className="font-semibold text-gray-500 text-lg">selected logbook WIP</span>
            </div>
            <div className="flex items-center py-4">
              <span className="font-semibold text-gray-500 text-lg">Pilot Logbook</span>
            </div>
            <div className="flex items-center space-x-1">
              <Link to={ROUTES.HOME} className="py-4 px-2 text-gray-500 hover:text-blue-500">Dashboard</Link>
              <Link to={ROUTES.NEW_FLIGHT} className="py-4 px-2 text-gray-500 hover:text-blue-500">New Flight</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}