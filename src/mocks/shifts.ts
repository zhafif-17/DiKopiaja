export interface Shift {
  id: string;
  cashierId: string;
  cashierName: string;
  status: "buka" | "tutup";
  openedAt: string;
  closedAt?: string;
  openingCash: number;
  expectedCash?: number;
  countedCash?: number;
  difference?: number;
  closingNote?: string;
  totalSales: number;
  totalTransactions: number;
}

export const MOCK_SHIFTS: Shift[] = [
  {
    id: "shift-005",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    status: "buka",
    openedAt: new Date(new Date().setHours(7, 0, 0, 0)).toISOString(),
    openingCash: 300000,
    totalSales: 1184500,
    totalTransactions: 18,
  },
  {
    id: "shift-004",
    cashierId: "user-003",
    cashierName: "Bayu Saputra",
    status: "tutup",
    openedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    closedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    openingCash: 300000,
    expectedCash: 876000,
    countedCash: 876000,
    difference: 0,
    closingNote: "Semua transaksi tunai dan non-tunai cocok.",
    totalSales: 576000,
    totalTransactions: 12,
  },
  {
    id: "shift-003",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    status: "tutup",
    openedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    closedAt: new Date(
      Date.now() - 2 * 24 * 3600000 + 8 * 3600000,
    ).toISOString(),
    openingCash: 300000,
    expectedCash: 1520000,
    countedCash: 1520000,
    difference: 0,
    closingNote: "Shift ramai siang hari, stok lancar.",
    totalSales: 1220000,
    totalTransactions: 24,
  },
  {
    id: "shift-002",
    cashierId: "user-003",
    cashierName: "Bayu Saputra",
    status: "tutup",
    openedAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    closedAt: new Date(
      Date.now() - 3 * 24 * 3600000 + 6 * 3600000,
    ).toISOString(),
    openingCash: 300000,
    expectedCash: 985000,
    countedCash: 970000,
    difference: -15000,
    closingNote:
      "Selisih Rp 15.000 akibat uang kembalian pecahan kecil saat antrean panjang.",
    totalSales: 685000,
    totalTransactions: 15,
  },
  {
    id: "shift-001",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    status: "tutup",
    openedAt: new Date(Date.now() - 4 * 24 * 3600000).toISOString(),
    closedAt: new Date(
      Date.now() - 4 * 24 * 3600000 + 8 * 3600000,
    ).toISOString(),
    openingCash: 300000,
    expectedCash: 1184500,
    countedCash: 1184500,
    difference: 0,
    closingNote: "Tutup shift tepat waktu, kas balance.",
    totalSales: 884500,
    totalTransactions: 19,
  },
];
