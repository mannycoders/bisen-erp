import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layout";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";

import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Vendors from "../pages/Vendors";
import Products from "../pages/Products";
import Inventory from "../pages/Inventory";
import Sales from "../pages/Sales";
import Purchases from "../pages/Purchases";
import Manufacturing from "../pages/Manufacturing";
import Transport from "../pages/Transport";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Logout from "../pages/auth/Logout";

export default function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/vendors" element={<Vendors />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/purchases" element={<Purchases />} />
                    <Route path="/manufacturing" element={<Manufacturing />} />
                    <Route path="/transport" element={<Transport />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}