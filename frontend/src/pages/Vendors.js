import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCcw,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import vendorService from "../api/vendorService";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    gst: "",
  });

  const pageSize = 5;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await vendorService.getVendors();
    setVendors(data);
    setLoading(false);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleNew() {
    setEditing(null);
    setForm({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      gst: "",
    });
    setShowModal(true);
  }

  function handleEdit(v) {
    setEditing(v);
    setForm({
      name: v.name || "",
      contactPerson: v.contactPerson || "",
      phone: v.phone || "",
      email: v.email || "",
      gst: v.gst || "",
    });
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) return showToast("Vendor name is required", "error");

    if (editing) {
      await vendorService.updateVendor(editing.id, form);
      showToast("Vendor updated successfully");
    } else {
      await vendorService.createVendor(form);
      showToast("Vendor added successfully");
    }

    setShowModal(false);
    await load();
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      await vendorService.deleteVendor(id);
      await load();
      showToast("Vendor deleted successfully");
    }
  }

  async function handleReset() {
    await vendorService.resetSample();
    await load();
    showToast("Sample data reloaded");
  }

  function handleExport() {
    const headers = ["Name", "Contact Person", "Phone", "Email", "GST"];
    const rows = vendors.map((v) => [
      v.name,
      v.contactPerson,
      v.phone,
      v.email,
      v.gst,
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendors.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported to CSV");
  }

  const filtered = vendors
    .filter(
      (v) =>
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        (v.contactPerson || "")
          .toLowerCase()
          .includes(query.toLowerCase())
    )
    .sort((a, b) => {
      const x = (a[sortBy] || "").toLowerCase();
      const y = (b[sortBy] || "").toLowerCase();
      if (x < y) return sortOrder === "asc" ? -1 : 1;
      if (x > y) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded text-white shadow-lg z-50 ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="border rounded pl-8 pr-3 py-2 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-2 rounded hover:bg-gray-200"
          >
            <RefreshCcw size={16} /> Reset
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200"
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={handleNew}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            <Plus size={16} /> New
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              {["name", "contactPerson", "phone", "email", "gst"].map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 text-left cursor-pointer select-none hover:text-blue-600"
                  onClick={() => toggleSort(key)}
                >
                  {key === "contactPerson"
                    ? "Contact"
                    : key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                  {sortBy === key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Loading vendors...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No vendors found.
                </td>
              </tr>
            ) : (
              paginated.map((v) => (
                <tr
                  key={v.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{v.name}</td>
                  <td className="px-4 py-2">{v.contactPerson || "-"}</td>
                  <td className="px-4 py-2">{v.phone || "-"}</td>
                  <td className="px-4 py-2">{v.email || "-"}</td>
                  <td className="px-4 py-2">{v.gst || "-"}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(v)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex justify-end items-center gap-2 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editing ? "Edit Vendor" : "New Vendor"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              {["name", "contactPerson", "phone", "email", "gst"].map(
                (field) => (
                  <input
                    key={field}
                    className="w-full border px-3 py-2 rounded"
                    placeholder={
                      field === "name"
                        ? "Vendor Name *"
                        : field === "contactPerson"
                        ? "Contact Person"
                        : field.charAt(0).toUpperCase() + field.slice(1)
                    }
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    required={field === "name"}
                  />
                )
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}