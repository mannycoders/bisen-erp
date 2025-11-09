import React, { useEffect, useState } from "react";
import { Plus, Search, RefreshCcw, Download, ChevronLeft, ChevronRight } from "lucide-react";
import salesService from "../api/salesService";

export default function Sales() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(()=>{ load(); },[]);

  async function load(){
    setLoading(true);
    const data = await salesService.getSales();
    setInvoices(data);
    setLoading(false);
  }

  async function handleReset(){ await salesService.resetSample(); await load(); }

  function handleExport(){
    const headers = ["InvoiceNo","Date","Customer","Amount","Status"];
    const rows = invoices.map(i => [i.invoiceNo, i.date, i.customer, i.amount, i.status]);
    const csv = [headers, ...rows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download="sales.csv"; a.click(); URL.revokeObjectURL(url);
  }

  const filtered = invoices.filter(i => i.invoiceNo.includes(query) || (i.customer||"").toLowerCase().includes(query.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4"/>
            <input className="border rounded pl-8 pr-3 py-2 text-sm" placeholder="Invoice # or customer" value={query} onChange={e=>setQuery(e.target.value)}/>
          </div>
          <button onClick={handleReset} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-1"><RefreshCcw size={14}/> Reset</button>
          <button onClick={handleExport} className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1"><Download size={14}/> Export</button>
          <button onClick={()=>alert("Create invoice UI not implemented yet")} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"><Plus size={14}/> New</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">Invoice #</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2 text-right">Amount</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td></tr> :
            paginated.length===0 ? <tr><td colSpan={5} className="p-6 text-center text-gray-500">No sales found</td></tr> :
            paginated.map(iv => (
              <tr key={iv.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{iv.invoiceNo}</td>
                <td className="px-4 py-2">{iv.date}</td>
                <td className="px-4 py-2">{iv.customer}</td>
                <td className="px-4 py-2 text-right">₹{iv.amount}</td>
                <td className="px-4 py-2">{iv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length>0 && (
        <div className="flex justify-end items-center gap-3 text-sm">
          <button onClick={()=>setPage(Math.max(1,page-1))} disabled={page===1} className="p-2 disabled:opacity-40"><ChevronLeft size={18}/></button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={()=>setPage(Math.min(totalPages,page+1))} disabled={page===totalPages} className="p-2 disabled:opacity-40"><ChevronRight size={18}/></button>
        </div>
      )}
    </div>
  );
}