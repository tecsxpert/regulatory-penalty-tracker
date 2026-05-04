import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import PenaltyList from "./pages/PenaltyList";
import Dashboard from "./pages/Dashboard";
import PenaltyDetail from "./pages/PenaltyDetail";
import PenaltyForm from "./pages/PenaltyForm";
import Analytics from "./pages/Analytics";

import { useState } from "react";
import AIPanel from "./components/AIPanel";
import api from "./services/api";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [refreshKey, setRefreshKey]           = useState(0);
  const [success, setSuccess]                 = useState("");
  const [menuOpen, setMenuOpen]               = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── NAVBAR ── */}
      <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-base md:text-lg font-bold text-gray-800 truncate max-w-[180px] md:max-w-none">
          Regulatory Penalty Tracker
        </h1>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-500">Hi, {user?.username}</span>
          <button onClick={() => navigate("/dashboard")}
            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-200 transition">
            Dashboard
          </button>
          <button onClick={() => navigate("/analytics")}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition">
            Analytics
          </button>
          <button onClick={handleLogout}
            className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-900 transition">
            Logout
          </button>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-gray-700 text-xl p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow px-4 py-3
          flex flex-col gap-2">
          <span className="text-sm text-gray-500">Hi, {user?.username}</span>
          <button onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm text-left hover:bg-gray-200">
            Dashboard
          </button>
          <button onClick={() => { navigate("/analytics"); setMenuOpen(false); }}
            className="bg-blue-600 text-white px-3 py-2 rounded text-sm text-left hover:bg-blue-700">
            Analytics
          </button>
          <button onClick={handleLogout}
            className="bg-gray-800 text-white px-3 py-2 rounded text-sm text-left hover:bg-gray-900">
            Logout
          </button>
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <div className="w-full max-w-screen-xl mx-auto px-3 md:px-6 py-4 space-y-4">

        {/* DASHBOARD + FORM — stack on mobile, side by side on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

          <div className="lg:col-span-2">
            <Dashboard />
          </div>

          <div className="lg:sticky lg:top-4">
            <PenaltyForm
              penalty={selectedPenalty}
              onSuccess={() => {
                setSuccess("Saved successfully");
                setRefreshKey(prev => prev + 1);
                setSelectedPenalty(null);
                setTimeout(() => setSuccess(""), 3000);
              }}
            />
          </div>
        </div>

        {success && (
          <p className="bg-green-100 text-green-700 p-2 rounded text-sm">{success}</p>
        )}

        <PenaltyList key={refreshKey} onEdit={setSelectedPenalty} />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard"
            element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
          <Route path="/analytics"
            element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/penalties/:id"
            element={<ProtectedRoute><PenaltyDetail /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;