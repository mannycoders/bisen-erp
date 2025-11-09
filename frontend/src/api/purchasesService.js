const KEY = "bisen_purchases_v1";
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
function read(){ try{ const r = localStorage.getItem(KEY); return r?JSON.parse(r):[] }catch{return []} }
function write(d){ localStorage.setItem(KEY, JSON.stringify(d)); }

export default {
  async getPurchases(){ await new Promise(r=>setTimeout(r,150)); return read(); },
  async createPurchase(p){ const list=read(); const it={ id: uid(), ...p }; list.unshift(it); write(list); return it; },
  async updatePurchase(id,p){ const list=read(); const idx=list.findIndex(x=>x.id===id); if(idx!==-1){ list[idx]={...list[idx],...p}; write(list); return list[idx]; } throw new Error("not_found"); },
  async deletePurchase(id){ const list=read().filter(x=>x.id!==id); write(list); return true; },
  async resetSample(){ const sample=[ { id: uid(), poNo:"PO-5001", date:"2025-07-20", vendor:"MetalWorks Fabricators", amount:56000, status:"Received" }, { id: uid(), poNo:"PO-5002", date:"2025-07-25", vendor:"SolarMount Solutions", amount:34000, status:"Pending" } ]; write(sample); return sample; }
};