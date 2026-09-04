import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("invoice_token")) return setLoading(false);
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem("invoice_token"))
      .finally(() => setLoading(false));
  }, []);
  const login = async (data) => {
    const result = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    localStorage.setItem("invoice_token", result.token);
    setUser(result.user);
  };
  const register = async (data) => {
    const result = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    localStorage.setItem("invoice_token", result.token);
    setUser(result.user);
  };
  const logout = () => {
    localStorage.removeItem("invoice_token");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
