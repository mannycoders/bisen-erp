import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import salesService from "../api/salesService";
import purchasesService from "../api/purchasesService";
import inventoryService from "../api/inventoryService";

export default function Reports(){
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ sales:0, purchases:0, stockValue:0 });
  useEffect(()=>{ load(); },[]);

  async function load(){
    setLoading(true);
    const sales = await salesService.getSales();
    const purchases = await purchasesService.getPurchases();
    const inventory = await inventoryService.getInventory();
    const totalSales = sales.reduce((s,x)=>s + (Number(x.amount)||0),0);
    const totalPurchases = purchases.reduce((s,x)=>s + (Number(x.amount)||0),0);
    const stockValue = inventory.reduce((s,i)=> s + ((Number(i.stock)||0) * (Number(i.unitPrice)||0)), 0);
    setSummary({ sales: totalSales, purchases: totalPurchases, stockValue });
    setLoading(false);
  }

  function exportSummary(){
    const csv = [["Metric","Value"], ["Total Sales", summary.sales], ["Total Purchases", summary.purchases], ["Stock Value", summary.stockValue]].map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"}); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="report_summary.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div>
          <button onClick={exportSummary} className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center gap-1"><Download size={14}/> Export Summary</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-600">Total Sales</h3>
          <div className="text-2xl font-bold">₹{loading ? "..." : summary.sales}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-600">Total Purchases</h3>
          <div className="text-2xl font-bold">₹{loading ? "..." : summary.purchases}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-sm text-gray-600">Stock Value (approx)</h3>
          <div className="text-2xl font-bold">₹{loading ? "..." : summary.stockValue}</div>
        </div>
      </div>
    </div>
  );
}