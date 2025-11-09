

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-lg text-gray-600">Logging out...</div>
    </div>
  );
}