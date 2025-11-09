const KEY = "bisen_inventory_v1";

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

function read(){
  try { const raw = localStorage.getItem(KEY); return raw? JSON.parse(raw): []; } catch { return []; }
}
function write(data){ localStorage.setItem(KEY, JSON.stringify(data)); }

export default {
  async getInventory(){
    await new Promise(r=>setTimeout(r,150));
    return read();
  },
  async createItem(payload){
    const list = read();
    const item = { id: uid(), ...payload };
    list.unshift(item);
    write(list);
    return item;
  },
  async updateItem(id,payload){
    const list = read();
    const idx = list.findIndex(x=>x.id===id);
    if(idx!==-1){ list[idx] = {...list[idx], ...payload}; write(list); return list[idx]; }
    throw new Error("not_found");
  },
  async deleteItem(id){
    const list = read().filter(x=>x.id!==id); write(list); return true;
  },
  async resetSample(){
    const sample = [
      { id: uid(), product: "Aluminium Bracket", category: "Finished Good", stock: 120, unit: "pcs", lowThreshold: 20 },
      { id: uid(), product: "Stainless Steel Rod", category: "Raw Material", stock: 250, unit: "kg", lowThreshold: 50 },
      { id: uid(), product: "Mounting Rail", category: "Finished Good", stock: 80, unit: "pcs", lowThreshold: 15 },
    ];
    write(sample);
    return sample;
  }
};