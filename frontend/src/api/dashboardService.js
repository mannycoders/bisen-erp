import reportsService from "./reportsService";
import salesService from "./salesService";
import purchasesService from "./purchasesService";

export default {
  async getDashboardSummary() {
    // Combines report + trend data
    const summary = await reportsService.getSummary();
    const sales = await salesService.getSales();
    const purchases = await purchasesService.getPurchases();

    // Prepare monthly trend data
    const months = {};
    sales.forEach((s) => {
      const month = (s.date || "").slice(0, 7); // YYYY-MM
      months[month] = months[month] || { month, Sales: 0, Purchases: 0 };
      months[month].Sales += Number(s.amount) || 0;
    });
    purchases.forEach((p) => {
      const month = (p.date || "").slice(0, 7);
      months[month] = months[month] || { month, Sales: 0, Purchases: 0 };
      months[month].Purchases += Number(p.amount) || 0;
    });

    const trend = Object.values(months).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    return { summary, trend };
  },
};