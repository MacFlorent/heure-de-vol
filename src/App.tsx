import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@/constants";
import Header from "@/components/Header";
import FlightForm from "@/features/flights/components/FlightForm";

function App() {
  return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path={ROUTES.HOME} element={<div>Dashboard (Coming soon)</div>} />
            <Route path={ROUTES.NEW_FLIGHT} element={<FlightForm />} />
          </Routes>
        </div>
      </div>
  );
}

export default App;