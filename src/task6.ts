export type Invoice = { id: string; amount: number; status: "paid" | "free" };

export function sumByStatus(invoices: readonly Invoice[]): { paid: number; free: number } {
  return invoices.reduce((totals, invoice) => {
    totals[invoice.status] += invoice.amount;
    return totals;
  }, { paid: 0, free: 0 });
}

console.log("Задача 6 — Суммы счетов");
const invoices: readonly Invoice[] = [
  { id: "1", amount: 100, status: "paid" },
  { id: "2", amount: 25, status: "free" },
  { id: "3", amount: 50, status: "paid" },
  { id: "4", amount: 10, status: "free" },
];
console.log("Смешанный набор:", sumByStatus(invoices));
console.log("Пустой массив:", sumByStatus([]));
console.log("Исходные записи:", invoices);
