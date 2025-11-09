const KEY = "bisen_products_v1";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export default {
  async getProducts() {
    await new Promise((r) => setTimeout(r, 200));
    return read();
  },
  async createProduct(payload) {
    const list = read();
    const item = { id: uid(), ...payload };
    list.unshift(item);
    write(list);
    return item;
  },
  async updateProduct(id, payload) {
    const list = read();
    const idx = list.findIndex((x) => x.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payload };
      write(list);
      return list[idx];
    }
    throw new Error("not_found");
  },
  async deleteProduct(id) {
    const list = read().filter((x) => x.id !== id);
    write(list);
    return true;
  },
  async resetSample() {
    const sample = [
      {
        id: uid(),
        name: "Aluminium Bracket",
        category: "Finished Good",
        stock: 120,
        unit: "pcs",
        description: "Standard solar panel fitting bracket",
      },
      {
        id: uid(),
        name: "Stainless Steel Rod",
        category: "Raw Material",
        stock: 250,
        unit: "kg",
        description: "Grade 304 stainless steel rods for fabrication",
      },
      {
        id: uid(),
        name: "Mounting Rail",
        category: "Finished Good",
        stock: 80,
        unit: "pcs",
        description: "Mounting rail used for solar installation",
      },
    ];
    write(sample);
    return sample;
  },
};