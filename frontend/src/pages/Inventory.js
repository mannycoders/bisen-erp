import React, { useEffect, useState } from "react";
import {
  Search,
  RefreshCcw,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import inventoryService from "../api/inventoryService";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const pageSize = 8;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await inventoryService.getInventory();
    setItems(data);
    setLoading(false);
  }

  async function handleReset() {
    await inventoryService.resetSample();
    await load();
  }

  function handleExport() {
    const headers = ["Product", "Category", "Stock", "Unit", "LowStockThreshold"];
    const rows = items.map((i) => [
      i.product,
      i.category,
      i.stock,
      i.unit,
      i.lowThreshold || "",
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = items
    .filter(
      (i) =>
        i.product.toLowerCase().includes(query.toLowerCase()) ||
        (i.category || "").toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      const x = (a[sortBy] || "").toString().toLowerCase();
      const y = (b[sortBy] || "").toString().toLowerCase();
      if (x < y) return sortOrder === "asc" ? -1 : 1;
      if (x > y) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(field) {
    if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
            <input
              className="border rounded pl-8 pr-3 py-2 text-sm"
              placeholder="Search product or category"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button onClick={handleReset} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-1">
            <RefreshCcw size={14} /> Reset
          </button>
          <button onClick={handleExport} className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 cursor-pointer" onClick={()=>toggleSort("product")}>Product {sortBy==="product" ? (sortOrder==="asc"?"↑":"↓") : ""}</th>
              <th className="px-4 py-2 cursor-pointer" onClick={()=>toggleSort("category")}>Category {sortBy==="category" ? (sortOrder==="asc"?"↑":"↓") : ""}</th>
              <th className="px-4 py-2 cursor-pointer" onClick={()=>toggleSort("stock")}>Stock {sortBy==="stock" ? (sortOrder==="asc"?"↑":"↓") : ""}</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Low Stock Threshold</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">No items</td></tr>
            ) : (
              paginated.map((it) => (
                <tr key={it.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{it.product}</td>
                  <td className="px-4 py-2">{it.category}</td>
                  <td className={`px-4 py-2 ${it.lowThreshold && it.stock <= it.lowThreshold ? "text-red-600 font-semibold" : ""}`}>{it.stock}</td>
                  <td className="px-4 py-2">{it.unit || "-"}</td>
                  <td className="px-4 py-2">{it.lowThreshold ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex justify-end items-center gap-3 text-sm">
          <button onClick={()=>setPage(Math.max(1,page-1))} disabled={page===1} className="p-2 disabled:opacity-40"><ChevronLeft size={18}/></button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={()=>setPage(Math.min(totalPages,page+1))} disabled={page===totalPages} className="p-2 disabled:opacity-40"><ChevronRight size={18}/></button>
        </div>
      )}
    </div>
  );
}