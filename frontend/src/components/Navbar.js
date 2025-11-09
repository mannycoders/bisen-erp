import { useLocation } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide navbar completely on login/register pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  if (hideNavbar) return null;

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Bisen ERP</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Welcome, {user?.name || "User"} ({roleLabel})
        </span>
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "User"
          )}&background=0D8ABC&color=fff`}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
        <button
          onClick={logout}
          className="p-2 rounded hover:bg-red-100 text-red-600 flex items-center space-x-1"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}