import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@/constants";
import Header from "@/components/Header";
import FlightForm from "@/features/flights/components/FlightForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Routes>
        <Route path={ROUTES.HOME} element={<div>Dashboard (Coming soon)</div>} />
        <Route path={ROUTES.NEW_FLIGHT} element={<FlightForm />} />
      </Routes>
    </div>
  );
}

export default App;