// import { createContext, useState, useEffect, type ReactNode } from "react";
// import { useNavigate } from "react-router-dom";
// import { customToast } from "../utils/customToast";

// type User = {
//   fullName: string;
//   id: string;
//   email: string;
//   isAdmin?: boolean;
// } | null;

// interface AuthContextType {
//   user: User;
//   token: string | null;
//   login: (user: User, token: string) => void;
//   logout: () => void;
//   loading: boolean; // ✅ ADD THIS
// }


// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   token: null,
//   login: () => {},
//   logout: () => {},
//   loading: true,
// });

// export default function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true); // ✅ ADD THIS
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");

//     if (storedUser && storedToken) {
//       setUser(JSON.parse(storedUser));
//       setToken(storedToken);
//     }

//     setLoading(false); // ✅ IMPORTANT
//   }, []);

//   const login = (user: User, token: string) => {
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("token", token);
//     setUser(user);
//     setToken(token);
//     customToast.success(`Welcome back, ${user?.fullName}!`);
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setUser(null);
//     setToken(null);
//     customToast.info("Logged out successfully");
//     navigate("/");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

import { createContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { customToast } from "../utils/customToast";

type User = {
  fullName: string;
  id: string;
  email: string;
  isAdmin?: boolean;
} | null;

interface AuthContextType {
  user: User;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
    customToast.success(`Welcome back, ${user?.fullName}!`);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    customToast.info("Logged out successfully");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
