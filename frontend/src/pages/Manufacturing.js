import React, { useEffect, useState } from "react";
import { RefreshCcw, Download } from "lucide-react";
import manufacturingService from "../api/manufacturingService";

export default function Manufacturing(){
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ load(); },[]);

  async function load(){ setLoading(true); const d = await manufacturingService.getJobs(); setJobs(d); setLoading(false); }
  async function handleReset(){ await manufacturingService.resetSample(); await load(); }

  function handleExport(){
    const headers=["JobNo","Product","Quantity","Status","Started"];
    const rows = jobs.map(j=>[j.jobNo,j.product,j.quantity,j.status,j.started]);
    const csv = [headers, ...rows].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url = URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="manufacturing_jobs.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manufacturing</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-1"><RefreshCcw size={14}/> Reset</button>
          <button onClick={handleExport} className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1"><Download size={14}/> Export</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {loading ? <div className="p-6 text-center text-gray-500">Loading...</div> :
          jobs.length===0 ? <div className="p-6 text-center text-gray-500">No jobs</div> :
          <ul className="space-y-2">
            {jobs.map(j => (
              <li key={j.id} className="border rounded px-4 py-3 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <div className="font-semibold">{j.jobNo} — {j.product}</div>
                  <div className="text-sm text-gray-600">Qty: {j.quantity} • Status: {j.status}</div>
                </div>
                <div className="text-sm text-gray-500">{j.started}</div>
              </li>
            ))}
          </ul>
        }
      </div>
    </div>
  );
}