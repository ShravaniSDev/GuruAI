import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-950 p-4">
      <h2 className="text-xl font-bold mb-6">Guru AI</h2>

      <nav className="flex flex-col space-y-4 text-sm">
        <Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
        <Link to="/target" className="hover:text-yellow-400">Target Protocol</Link>
        <Link to="/vault" className="hover:text-yellow-400">Vault</Link>
        <Link to="/notes" className="hover:text-yellow-400">Guru Notes</Link>
        <Link to="/progress" className="hover:text-yellow-400">Progress</Link>
        <Link to="/guruscore" className="hover:text-yellow-400">Guru Score</Link>
        <Link to="/timeline" className="hover:text-yellow-400">Guru Timeline</Link>
        <Link to="/settings" className="hover:text-yellow-400">Settings</Link>
        <Link to="/todays-target" className="hover:text-yellow-400">Today’s Target</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
