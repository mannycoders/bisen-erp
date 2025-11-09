const KEY = "bisen_vendors_v1";

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
  async getVendors() {
    await new Promise((r) => setTimeout(r, 200));
    return read();
  },
  async createVendor(payload) {
    const list = read();
    const item = { id: uid(), ...payload };
    list.unshift(item);
    write(list);
    return item;
  },
  async updateVendor(id, payload) {
    const list = read();
    const idx = list.findIndex((x) => x.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payload };
      write(list);
      return list[idx];
    }
    throw new Error("not_found");
  },
  async deleteVendor(id) {
    const list = read().filter((x) => x.id !== id);
    write(list);
    return true;
  },
  async resetSample() {
    const sample = [
      {
        id: uid(),
        name: "MetalWorks Fabricators",
        contactPerson: "Amit",
        phone: "9812345678",
        email: "amit@metalworks.com",
        gst: "09ABCDE1234F1Z9",
      },
      {
        id: uid(),
        name: "SolarMount Solutions",
        contactPerson: "Rajesh",
        phone: "9822334455",
        email: "rajesh@solarmount.com",
        gst: "27ABCDE1234F1Z5",
      },
      {
        id: uid(),
        name: "BrightSteel Industries",
        contactPerson: "Kumar",
        phone: "9876501234",
        email: "kumar@brightsteel.in",
        gst: "33ABCDE1234F1Z8",
      },
    ];
    write(sample);
    return sample;
  },
};