const KEY = "bisen_customers_v1";

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
  async getCustomers() {
    await new Promise((r) => setTimeout(r, 200));
    return read();
  },
  async createCustomer(payload) {
    const list = read();
    const item = { id: uid(), ...payload };
    list.unshift(item);
    write(list);
    return item;
  },
  async updateCustomer(id, payload) {
    const list = read();
    const idx = list.findIndex((x) => x.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payload };
      write(list);
      return list[idx];
    }
    throw new Error("not_found");
  },
  async deleteCustomer(id) {
    const list = read().filter((x) => x.id !== id);
    write(list);
    return true;
  },
  async resetSample() {
    const sample = [
      {
        id: uid(),
        name: "Acme Solar Components",
        contactPerson: "Ramesh",
        phone: "9876543210",
        email: "acme@example.com",
        gst: "27ABCDE1234F1Z5",
      },
      {
        id: uid(),
        name: "Sharma Fabricators",
        contactPerson: "Suresh",
        phone: "9123456780",
        email: "sharma@example.com",
        gst: "07ABCDE1234F1Z6",
      },
      {
        id: uid(),
        name: "SunTrack Fittings",
        contactPerson: "Manoj",
        phone: "9988776655",
        email: "suntrack@example.com",
        gst: "29ABCDE1234F1Z7",
      },
    ];
    write(sample);
    return sample;
  },
};