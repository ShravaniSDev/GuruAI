import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-950 p-4">
      <h2 className="text-xl font-bold mb-6">Guru AI</h2>
      <nav className="space-y-4 text-sm">
        <Link to="/dashboard" className="block hover:text-yellow-400">Dashboard</Link>
        <Link to="/target" className="block hover:text-yellow-400">Target Protocol</Link>
        <Link to="/vault" className="block hover:text-yellow-400">Vault</Link>
        <Link to="/notes" className="block hover:text-yellow-400">Guru Notes</Link>
        <Link to="/progress" className="block hover:text-yellow-400">Progress</Link>
        <Link to="/guruscore" className="block hover:text-yellow-400">Guru Score</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
