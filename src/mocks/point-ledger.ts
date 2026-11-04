export type PointMutationType = 'dapat' | 'tukar' | 'koreksi';

export interface PointLedgerEntry {
  id: string;
  customerId: string;
  saleId?: string;
  type: PointMutationType;
  points: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
}

export const MOCK_POINT_LEDGER: PointLedgerEntry[] = [
  {
    id: 'pt-001',
    customerId: 'cust-001',
    saleId: 'sale-021',
    type: 'dapat',
    points: 4,
    balanceAfter: 245,
    note: 'Poin dari transaksi DKP-20250814-0021',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'pt-002',
    customerId: 'cust-001',
    saleId: 'sale-010',
    type: 'tukar',
    points: -20,
    balanceAfter: 241,
    note: 'Penukaran 20 poin potongan belanja Rp 2.000',
    createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
  {
    id: 'pt-003',
    customerId: 'cust-001',
    saleId: 'sale-008',
    type: 'dapat',
    points: 15,
    balanceAfter: 261,
    note: 'Poin dari transaksi DKP-20250812-0008',
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
  {
    id: 'pt-004',
    customerId: 'cust-001',
    type: 'koreksi',
    points: 10,
    balanceAfter: 246,
    note: 'Bonus loyalitas member gold',
    createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
  },
];

