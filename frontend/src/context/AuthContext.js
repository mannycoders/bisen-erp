import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Dummy authentication state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bisenUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Placeholder logic — later connect to backend API
    const dummyUser = { email, role: "admin", name: "Aakash" };
    setUser(dummyUser);
    localStorage.setItem("bisenUser", JSON.stringify(dummyUser));
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bisenUser");
    navigate("/login");
  };

  const register = (name, email, password) => {
    // Placeholder registration logic
    const newUser = { name, email, role: "staff" };
    localStorage.setItem("bisenUser", JSON.stringify(newUser));
    setUser(newUser);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);