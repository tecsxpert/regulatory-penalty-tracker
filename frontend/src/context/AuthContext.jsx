import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (username, password) => {
  try {
    // Try real backend first
    const res = await api.post("/auth/login", { username, password });

    const userData = { username, token: res.data.token };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return true;

  } catch (err) {
    // DEV MODE FALLBACK (admin/admin123)
    if (username === "admin" && password === "admin123") {
      const userData = {
        username: "admin",
        token: "dev-token-123", // fake token
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }

    return false;
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);