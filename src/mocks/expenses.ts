export interface Expense {
  id: string;
  shiftId?: string;
  category: string;
  amount: number;
  note?: string;
  expenseDate: string;
  createdBy: string;
  createdByName: string;
}

export const MOCK_EXPENSES: Expense[] = [
  {
    id: "exp-001",
    shiftId: "shift-001",
    category: "Listrik PLN",
    amount: 450000,
    note: "Tagihan listrik bulan berjalan",
    expenseDate: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    createdBy: "user-001",
    createdByName: "Muhammad Zhafif",
  },
  {
    id: "exp-002",
    shiftId: "shift-001",
    category: "Es Batu dan Sirup",
    amount: 120000,
    note: "Pembelian es batu kristal 10 kg dan sirup",
    expenseDate: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    createdBy: "user-002",
    createdByName: "Dewi Lestari",
  },
  {
    id: "exp-003",
    shiftId: "shift-002",
    category: "Kebersihan",
    amount: 75000,
    note: "Sabun cuci piring, kantong sampah, dan kain lap",
    expenseDate: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    createdBy: "user-003",
    createdByName: "Bayu Saputra",
  },
  {
    id: "exp-004",
    shiftId: "shift-003",
    category: "Transportasi",
    amount: 50000,
    note: "Biaya kirim bahan baku mendesak",
    expenseDate: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    createdBy: "user-001",
    createdByName: "Muhammad Zhafif",
  },
  {
    id: "exp-005",
    shiftId: "shift-005",
    category: "Bahan Baku",
    amount: 320000,
    note: "Susu segar 10 liter dan gula aren cair 5 kg",
    expenseDate: new Date().toISOString(),
    createdBy: "user-002",
    createdByName: "Dewi Lestari",
  },
];
