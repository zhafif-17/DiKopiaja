export type VoucherType = 'persen' | 'nominal';

export interface Voucher {
  id: string;
  code: string;
  type: VoucherType;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  quota: number;
  usedCount: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: 'voucher-001',
    code: 'SENJA10',
    type: 'persen',
    value: 10,
    minPurchase: 50000,
    maxDiscount: 15000,
    quota: 200,
    usedCount: 87,
    startsAt: '2025-01-01T00:00:00+07:00',
    endsAt: '2025-12-31T23:59:59+07:00',
    isActive: true,
  },
  {
    id: 'voucher-002',
    code: 'MERDEKA17',
    type: 'nominal',
    value: 17000,
    minPurchase: 85000,
    quota: 100,
    usedCount: 43,
    startsAt: '2025-08-01T00:00:00+07:00',
    endsAt: '2025-08-31T23:59:59+07:00',
    isActive: true,
  },
  {
    id: 'voucher-003',
    code: 'NEWMEMBER',
    type: 'persen',
    value: 15,
    minPurchase: 30000,
    maxDiscount: 20000,
    quota: 500,
    usedCount: 312,
    startsAt: '2025-01-01T00:00:00+07:00',
    endsAt: '2025-06-30T23:59:59+07:00',
    isActive: false,
  },
];

