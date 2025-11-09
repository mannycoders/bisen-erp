import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Truck,
  Wrench,
  ClipboardList,
  FileText,
  Settings,
  BarChart2,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const { user } = useAuth();

  // Define role-based navigation structure
  const baseLinks = [
    { to: "/", label: "Dashboard", icon: <Home size={18} /> },
  ];

  const adminLinks = [
    { to: "/customers", label: "Customers", icon: <Users size={18} /> },
    { to: "/vendors", label: "Vendors", icon: <Building2 size={18} /> },
    { to: "/products", label: "Products", icon: <Package size={18} /> },
    { to: "/inventory", label: "Inventory", icon: <ClipboardList size={18} /> },
    { to: "/sales", label: "Sales", icon: <ShoppingCart size={18} /> },
    { to: "/purchases", label: "Purchases", icon: <FileText size={18} /> },
    { to: "/manufacturing", label: "Manufacturing", icon: <Wrench size={18} /> },
    { to: "/transport", label: "Transport", icon: <Truck size={18} /> },
    { to: "/reports", label: "Reports", icon: <BarChart2 size={18} /> },
  ];

  const managerLinks = [
    { to: "/inventory", label: "Inventory", icon: <ClipboardList size={18} /> },
    { to: "/sales", label: "Sales", icon: <ShoppingCart size={18} /> },
    { to: "/purchases", label: "Purchases", icon: <FileText size={18} /> },
    { to: "/reports", label: "Reports", icon: <BarChart2 size={18} /> },
  ];

  const staffLinks = [
    { to: "/inventory", label: "Inventory", icon: <ClipboardList size={18} /> },
    { to: "/sales", label: "Sales", icon: <ShoppingCart size={18} /> },
  ];

  const finalLinks = [
    ...baseLinks,
    ...(user?.role === "admin"
      ? adminLinks
      : user?.role === "manager"
      ? managerLinks
      : user?.role === "staff"
      ? staffLinks
      : []),
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  // Hide sidebar on login/register
  if (
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  return (
    <aside
      className={`bg-white shadow-lg fixed md:static top-0 left-0 h-full md:h-auto w-64 transform md:translate-x-0 transition-transform duration-200 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b font-bold text-xl text-blue-700">
        Bisen ERP
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {finalLinks.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-blue-50 ${
                active
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 w-full border-t p-3 text-xs text-center text-gray-500">
        {user?.role
          ? `Logged in as ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`
          : "Not logged in"}
      </div>
    </aside>
  );
}