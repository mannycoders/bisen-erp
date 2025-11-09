const KEY = "bisen_manufacturing_v1";
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
function read(){ try{ const r=localStorage.getItem(KEY); return r?JSON.parse(r):[] }catch{return []} }
function write(d){ localStorage.setItem(KEY, JSON.stringify(d)); }

export default {
  async getJobs(){ await new Promise(r=>setTimeout(r,120)); return read(); },
  async createJob(p){ const list=read(); const it={ id: uid(), ...p }; list.unshift(it); write(list); return it; },
  async updateJob(id,p){ const list=read(); const idx=list.findIndex(x=>x.id===id); if(idx!==-1){ list[idx]={...list[idx],...p}; write(list); return list[idx]; } throw new Error("not_found"); },
  async resetSample(){ const sample=[
    { id: uid(), jobNo:"JOB-2001", product:"Aluminium Bracket", quantity:200, status:"In Progress", started:"2025-08-01" },
    { id: uid(), jobNo:"JOB-2002", product:"Mounting Rail", quantity:50, status:"Completed", started:"2025-07-15" },
  ]; write(sample); return sample; }
};