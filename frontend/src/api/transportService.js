const KEY = "bisen_transport_v1";
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
function read(){ try{ const r=localStorage.getItem(KEY); return r?JSON.parse(r):[] }catch{return []} }
function write(d){ localStorage.setItem(KEY, JSON.stringify(d)); }

export default {
  async getTrips(){ await new Promise(r=>setTimeout(r,120)); return read(); },
  async createTrip(p){ const list=read(); const it={ id: uid(), ...p }; list.unshift(it); write(list); return it; },
  async updateTrip(id,p){ const list=read(); const idx=list.findIndex(x=>x.id===id); if(idx!==-1){ list[idx] = {...list[idx],...p}; write(list); return list[idx]; } throw new Error("not_found"); },
  async deleteTrip(id){ const list=read().filter(x=>x.id!==id); write(list); return true; },
  async resetSample(){ const sample=[ { id: uid(), vehicle:"TN-01-AB-1234", driver:"Raju", deliveryNo:"DLV-9001", status:"Out for Delivery", eta:"2025-08-25" }, { id: uid(), vehicle:"DL-07-XY-6789", driver:"Kamal", deliveryNo:"DLV-9002", status:"Delivered", eta:"2025-08-20" } ]; write(sample); return sample; }
};