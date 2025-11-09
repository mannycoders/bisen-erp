import React, { useEffect, useState } from "react";
import { Search, RefreshCcw, Download, ChevronLeft, ChevronRight } from "lucide-react";
import purchasesService from "../api/purchasesService";

export default function Purchases(){
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(()=>{ load(); },[]);

  async function load(){ setLoading(true); const d = await purchasesService.getPurchases(); setPurchases(d); setLoading(false); }
  async function handleReset(){ await purchasesService.resetSample(); await load(); }

  function handleExport(){
    const headers=["PO#","Date","Vendor","Amount","Status"];
    const rows = purchases.map(p=>[p.poNo,p.date,p.vendor,p.amount,p.status]);
    const csv = [headers, ...rows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url = URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="purchases.csv"; a.click(); URL.revokeObjectURL(url);
  }

  const filtered = purchases.filter(p => p.poNo.includes(query) || (p.vendor||"").toLowerCase().includes(query.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Purchases</h1>
        <div className="flex items-center gap-3">
          <div className="relative"><Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4"/><input className="border rounded pl-8 pr-3 py-2 text-sm" placeholder="PO# or vendor" value={query} onChange={e=>setQuery(e.target.value)}/></div>
          <button onClick={handleReset} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-1"><RefreshCcw size={14}/> Reset</button>
          <button onClick={handleExport} className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1"><Download size={14}/> Export</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            <tr><th className="px-4 py-2">PO#</th><th className="px-4 py-2">Date</th><th className="px-4 py-2">Vendor</th><th className="px-4 py-2 text-right">Amount</th><th className="px-4 py-2">Status</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td></tr> :
            paginated.length===0 ? <tr><td colSpan={5} className="p-6 text-center text-gray-500">No purchases</td></tr> :
            paginated.map(p => <tr key={p.id} className="border-t hover:bg-gray-50"><td className="px-4 py-2">{p.poNo}</td><td className="px-4 py-2">{p.date}</td><td className="px-4 py-2">{p.vendor}</td><td className="px-4 py-2 text-right">₹{p.amount}</td><td className="px-4 py-2">{p.status}</td></tr>)}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length>0 && <div className="flex justify-end items-center gap-3 text-sm"><button onClick={()=>setPage(Math.max(1,page-1))} disabled={page===1} className="p-2 disabled:opacity-40"><ChevronLeft size={18}/></button><span>Page {page} of {totalPages}</span><button onClick={()=>setPage(Math.min(totalPages,page+1))} disabled={page===totalPages} className="p-2 disabled:opacity-40"><ChevronRight size={18}/></button></div>}
    </div>
  );
}