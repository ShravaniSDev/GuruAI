import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
// (you can create these later)
import TargetProtocol from "./pages/TargetProtocol";
import Vault from "./pages/Vault";
import GuruNotes from "./pages/GuruNotes";
import Progress from "./pages/Progress";
import GuruScore from "./pages/GuruScore";

function App() {
  return (
    <div className="flex h-screen text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-900">
        <Topbar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/target" element={<TargetProtocol />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/notes" element={<GuruNotes />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/guruscore" element={<GuruScore />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
