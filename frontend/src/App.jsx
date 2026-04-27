import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import PenaltyList from "./pages/PenaltyList";
import Dashboard from "./pages/Dashboard";
import PenaltyDetail from "./pages/PenaltyDetail";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          Welcome, {user?.username}
        </h1>

        <button
          onClick={handleLogout}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* DASHBOARD */}
      <Dashboard />

      {/* LIST */}
      <PenaltyList />

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