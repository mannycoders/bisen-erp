import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { RefreshCcw } from "lucide-react";
import dashboardService from "../api/dashboardService";

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalSales: 0, totalPurchases: 0, stockValue: 0 });
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await dashboardService.getDashboardSummary();
    setSummary(data.summary);
    setTrend(data.trend);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={load} className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded">
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-600">Total Sales</h3>
          <div className="text-2xl font-bold text-green-700">
            ₹{loading ? "..." : summary.totalSales.toLocaleString()}
          </div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-600">Total Purchases</h3>
          <div className="text-2xl font-bold text-blue-700">
            ₹{loading ? "..." : summary.totalPurchases.toLocaleString()}
          </div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-600">Stock Value</h3>
          <div className="text-2xl font-bold text-yellow-700">
            ₹{loading ? "..." : summary.stockValue.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h3 className="text-lg font-semibold mb-4">Sales vs Purchases Trend</h3>
        {loading ? (
          <div className="text-gray-500 italic text-center py-10">Loading chart...</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Sales" fill="#22c55e" />
              <Bar dataKey="Purchases" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}