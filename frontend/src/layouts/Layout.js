import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-6 bg-gray-50 flex-1">{children}</main>
      </div>
    </div>
  );
}