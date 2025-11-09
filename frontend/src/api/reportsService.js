import salesService from "./salesService";
import purchasesService from "./purchasesService";
import inventoryService from "./inventoryService";

export default {
  async getSummary() {
    const [sales, purchases, inventory] = await Promise.all([
      salesService.getSales(),
      purchasesService.getPurchases(),
      inventoryService.getInventory(),
    ]);

    const totalSales = sales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
    const totalPurchases = purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const stockValue = inventory.reduce(
      (sum, i) => sum + ((Number(i.stock) || 0) * (Number(i.unitPrice) || 0)),
      0
    );

    return { totalSales, totalPurchases, stockValue };
  },

  async exportSummaryCSV(summary) {
    const csv = [
      ["Metric", "Value"],
      ["Total Sales", summary.totalSales],
      ["Total Purchases", summary.totalPurchases],
      ["Estimated Stock Value", summary.stockValue],
    ]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report_summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  },
};