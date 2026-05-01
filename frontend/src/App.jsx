import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import PenaltyList from "./pages/PenaltyList";
import Dashboard from "./pages/Dashboard";
import PenaltyDetail from "./pages/PenaltyDetail";
import PenaltyForm from "./pages/PenaltyForm";
import { useState, useEffect } from "react";
import Analytics from "./pages/Analytics";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // EDIT FROM DETAIL
  useEffect(() => {
    if (location.state?.editPenalty) {
      setSelectedPenalty(location.state.editPenalty);
    }
  }, [location.state]);

  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          Welcome, {user?.username}
        </h1>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate("/analytics")}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Analytics
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </div>

      {/* DASHBOARD + FORM SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* LEFT - Dashboard */}
        <div className="md:col-span-2">
          <Dashboard />
        </div>

        {/* RIGHT - FORM */}
        <div>
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
        <p className="bg-green-100 text-green-700 p-2 mb-3 rounded">
          {success}
        </p>
      )}

      {/* LIST */}
      <PenaltyList key={refreshKey} onEdit={setSelectedPenalty} />

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/penalties/:id"
            element={
              <ProtectedRoute>
                <PenaltyDetail />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;