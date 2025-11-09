const KEY = "bisen_sales_v1";
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function read(){ try{ const r = localStorage.getItem(KEY); return r?JSON.parse(r):[] }catch{return []} }
function write(d){ localStorage.setItem(KEY, JSON.stringify(d)); }

export default {
  async getSales(){ await new Promise(r=>setTimeout(r,150)); return read(); },
  async createSale(payload){ const list = read(); const it = { id: uid(), ...payload }; list.unshift(it); write(list); return it; },
  async updateSale(id,payload){ const list = read(); const idx=list.findIndex(x=>x.id===id); if(idx!==-1){ list[idx] = {...list[idx],...payload}; write(list); return list[idx]; } throw new Error("not_found"); },
  async deleteSale(id){ const list = read().filter(x=>x.id!==id); write(list); return true; },
  async resetSample(){ const sample = [
    { id: uid(), invoiceNo: "INV-1001", date: "2025-08-01", customer: "Acme Solar Components", amount: 124500, status: "Paid" },
    { id: uid(), invoiceNo: "INV-1002", date: "2025-08-05", customer: "Sharma Fabricators", amount: 87300, status: "Pending" },
    { id: uid(), invoiceNo: "INV-1003", date: "2025-08-12", customer: "SunTrack Fittings", amount: 45200, status: "Paid" },
  ]; write(sample); return sample; }
};