import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../api";
import type { User } from "../types";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      setAuthToken(token);
      try {
        const { data } = await api.get("/auth/me");
        setUser({ id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin });
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    void boot();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setAuthToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/signup", { name, email, password });
    setToken(data.token);
    setAuthToken(data.token);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  const value = useMemo(() => ({ user, token, loading, login, signup, logout }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
