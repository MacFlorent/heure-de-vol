import { Routes, Route } from "react-router-dom";
import { ROUTES } from "@/constants";
import Header from "@/components/Header";
import LogbookList from "@/features/logbooks/components/LogbookList";
import FlightList from "@/features/flights/components/FlightList";

function App() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <Routes>
        <Route path={ROUTES.HOME} element={<div>Dashboard (Coming soon)</div>} />
        <Route path={ROUTES.FLIGHTS} element={<FlightList />} />
        <Route path={ROUTES.LOGBOOKS} element={<LogbookList />} />
      </Routes>
    </div>
  );
}

export default App;