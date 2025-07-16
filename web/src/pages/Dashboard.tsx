import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleGoToNotes = () => {
    navigate('/notes');
  };

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Welcome, Shravani</h1>
      <p className="text-lg text-gray-300">🚀 Your productivity starts here...</p>

      {/* ✅ Real Tailwind Button */}
      <button
        onClick={handleGoToNotes}
        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
      >
        Go to Guru Notes
      </button>
    </main>
  );
}

export default Dashboard;
