import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password are required");
      return;
    }
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-sm">

        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Regulatory Penalty Tracker
        </h2>

        {error && (
          <p className="text-red-500 mb-3 text-sm bg-red-50 p-2 rounded">{error}</p>
        )}

        <label className="text-sm text-gray-600 mb-1 block">Username</label>
        <input
          className="border p-2 mb-3 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="text-sm text-gray-600 mb-1 block">Password</label>
        <div className="relative mb-4">
          <input
            className="border p-2 w-full rounded text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2 cursor-pointer text-gray-500"
          >
            {show ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
          </span>
        </div>

        <button
          disabled={loading}
          className="bg-blue-600 text-white p-2 w-full rounded text-sm
            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;