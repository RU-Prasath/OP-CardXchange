import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("securestego_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await authService.getCurrentUser();
        setUser(me);
      } catch (error) {
        localStorage.removeItem("securestego_token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem("securestego_token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    localStorage.setItem("securestego_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore — clear locally anyway
    }
    localStorage.removeItem("securestego_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};