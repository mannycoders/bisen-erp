import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bisenUser");
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  const login = (email, password) => {
    const storedUser = localStorage.getItem("bisenUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.email === email) {
        setUser(parsedUser);
        navigate("/");
      }
    }
  };

  const register = (name, email, password) => {
    const existingUser = localStorage.getItem("bisenUser");
    const isFirstUser = !existingUser;
    const newUser = {
      name,
      email,
      role: isFirstUser ? "admin" : "staff",
    };
    localStorage.setItem("bisenUser", JSON.stringify(newUser));
    setUser(newUser);
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bisenUser");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);