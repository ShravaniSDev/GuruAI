import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import Dashboard from './pages/Dashboard';
import TargetProtocol from './pages/TargetProtocol';
import Vault from './pages/Vault';
import GuruNotes from './pages/GuruNotes';
import Progress from './pages/Progress';
import GuruScore from './pages/GuruScore';
import GuruTimeline from './pages/GuruTimeline';
import Settings from './pages/Settings';
import TodayPage from './features/todaysTarget/TodayPage';
import { TodayTargetProvider } from './features/todaysTarget/context'; // ✅ Context Provider

function App() {
  return (
    <TodayTargetProvider> {/* ✅ Wrap entire app */}
      <div className="flex h-screen text-white">
        <Sidebar />

        <div className="flex-1 flex flex-col bg-gray-900">
          <Topbar />

          <div className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/target" element={<TargetProtocol />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/notes" element={<GuruNotes />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/guruscore" element={<GuruScore />} />
              <Route path="/timeline" element={<GuruTimeline />} />
              <Route path="/settings" element={<Settings />} />
             <Route path="/todays-target" element={<TodayPage />} />
{/* ✅ New Route */}
            </Routes>
          </div>
        </div>
      </div>
    </TodayTargetProvider>
  );
}

export default App;
