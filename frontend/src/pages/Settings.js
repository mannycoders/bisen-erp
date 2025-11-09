import React from "react";
import {
  Trash2,
  RefreshCcw,
  Shield,
} from "lucide-react";
import vendorService from "../api/vendorService";
import productService from "../api/productService";
import customerService from "../api/partyService";
import inventoryService from "../api/inventoryService";
import salesService from "../api/salesService";
import purchasesService from "../api/purchasesService";
import manufacturingService from "../api/manufacturingService";
import transportService from "../api/transportService";

export default function Settings() {
  async function clearAllData() {
    if (!window.confirm("This will delete all saved data. Continue?")) return;
    localStorage.clear();
    alert("All local data cleared!");
    window.location.reload();
  }

  async function resetAllModules() {
    if (!window.confirm("Reset all modules to sample data?")) return;
    await Promise.all([
      vendorService.resetSample(),
      productService.resetSample(),
      customerService.resetSample(),
      inventoryService.resetSample(),
      salesService.resetSample(),
      purchasesService.resetSample(),
      manufacturingService.resetSample(),
      transportService.resetSample(),
    ]);
    alert("All modules reset to sample data!");
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-lg font-semibold">Data Management</h2>
        <p className="text-gray-600 text-sm">
          Manage stored data for all modules of your application.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={resetAllModules}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            <RefreshCcw size={16} /> Reset All Sample Data
          </button>
          <button
            onClick={clearAllData}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            <Trash2 size={16} /> Clear All Local Data
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-lg font-semibold">System Information</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>Version: <span className="font-medium text-gray-800">v1.0.0 (Frontend Only)</span></li>
          <li>Storage: <span className="font-medium text-gray-800">LocalStorage</span></li>
          <li>Environment: <span className="font-medium text-gray-800">Development (Mac)</span></li>
        </ul>
      </div>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield size={18} /> Privacy Notice
        </h2>
        <p className="text-sm text-gray-600">
          This prototype runs entirely on your local machine. No data is sent to any server.
          Once backend APIs are connected, user authentication and data encryption will be enforced.
        </p>
      </div>
    </div>
  );
}