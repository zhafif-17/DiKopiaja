export type NotifType = 'stok_menipis' | 'laporan_harian' | 'shift' | 'pembayaran' | 'sistem';

export interface Notification {
  id: string;
  userId: string;
  type: NotifType;
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    userId: 'user-001',
    type: 'stok_menipis',
    title: 'Stok Menipis: Americano',
    body: 'Stok Americano (SKU: KS-002) tersisa 8 gelas, di bawah batas minimum 10 gelas. Segera lakukan restok.',
    link: '/inventaris/prod-002',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'notif-002',
    userId: 'user-001',
    type: 'laporan_harian',
    title: 'Ringkasan Laporan Harian',
    body: 'Penjualan hari ini: Rp 2.847.000 dari 38 transaksi. Laba kotor: Rp 1.245.000. Periksa detail laporan.',
    link: '/laporan/laba-rugi',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'notif-003',
    userId: 'user-001',
    type: 'shift',
    title: 'Shift Ditutup: Dinda Lestari',
    body: 'Shift pagi Dinda Lestari (07.00 - 15.00) ditutup dengan total penjualan Rp 1.184.500. Selisih kas: Rp 0.',
    link: '/shift',
    isRead: true,
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: 'notif-004',
    userId: 'user-001',
    type: 'pembayaran',
    title: 'Pembayaran Gagal',
    body: '1 transaksi QRIS gagal dalam 1 jam terakhir. Periksa koneksi Midtrans atau status pelanggan.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'notif-005',
    userId: 'user-001',
    type: 'stok_menipis',
    title: 'Stok Menipis: Pisang Goreng Krispi',
    body: 'Stok Pisang Goreng Krispi (SKU: KS-012) tersisa 3 porsi, di bawah batas minimum 4 porsi.',
    link: '/inventaris/prod-012',
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

