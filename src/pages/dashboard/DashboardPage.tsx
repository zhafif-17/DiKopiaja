import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Package,
  Users,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRupiah, formatTime } from '@/lib/utils';
import { MOCK_SALES } from '@/mocks/sales';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { MOCK_SHIFTS } from '@/mocks/shifts';

// 7 Days sales trend dummy
const SALES_7_DAYS = [
  { day: 'Sen', date: '28 Okt', total: 1850000, transactions: 28 },
  { day: 'Sel', date: '29 Okt', total: 2100000, transactions: 32 },
  { day: 'Rab', date: '30 Okt', total: 1950000, transactions: 29 },
  { day: 'Kam', date: '31 Okt', total: 2400000, transactions: 36 },
  { day: 'Jum', date: '01 Nov', total: 3150000, transactions: 45 },
  { day: 'Sab', date: '02 Nov', total: 4200000, transactions: 62 },
  { day: 'Min', date: '03 Nov', total: 2847000, transactions: 38 },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Low stock products count
  const lowStockProducts = MOCK_PRODUCTS.filter((p) => p.stock <= p.minStock);
  const activeShift = MOCK_SHIFTS.find((s) => s.status === 'buka');

  // Compute stats
  const todayTotal = 2847000;
  const todayTransactions = 38;
  const grossProfit = 1245000;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-foreground">
            Ringkasan Penjualan Hari Ini
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pantau arus kas, performa shift, dan pergerakan inventaris toko Anda secara langsung.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => navigate('/kasir')}
            className="gap-2 font-bold shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            Buka Layar Kasir
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Penjualan */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-muted-foreground">
                Total Penjualan Hari Ini
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-heading font-extrabold text-2xl text-foreground tabular-nums count-animate">
                {formatRupiah(todayTotal)}
              </div>
              <div className="flex items-center space-x-1 text-xs text-emerald-600 mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+14.2% dari kemarin</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jumlah Transaksi */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-muted-foreground">
                Jumlah Transaksi
              </span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-heading font-extrabold text-2xl text-foreground tabular-nums count-animate">
                {todayTransactions}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Rata-rata Rp 74.920 / struk
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estimasi Laba Kotor */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-muted-foreground">
                Estimasi Laba Kotor
              </span>
              <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-heading font-extrabold text-2xl text-foreground tabular-nums count-animate">
                {formatRupiah(grossProfit)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Margin kotor: 43.7%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stok Menipis Warning */}
        <Card
          className={`shadow-sm cursor-pointer transition-colors ${
            lowStockProducts.length > 0
              ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70'
              : 'border-border'
          }`}
          onClick={() => navigate('/inventaris')}
        >
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-muted-foreground">
                Peringatan Stok
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-heading font-extrabold text-2xl text-amber-700 tabular-nums">
                {lowStockProducts.length} Produk
              </div>
              <div className="text-xs text-amber-800 font-medium mt-1 flex items-center gap-1">
                <span>Di bawah batas minimum</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Sales Chart & Active Shift Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts 7 Days Sales Trend (8 Cols) */}
        <Card className="lg:col-span-8 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Grafik Penjualan 7 Hari Terakhir</CardTitle>
              <CardDescription>
                Tren perolehan omzet harian kedai kopi
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/laporan/laba-rugi')}
              className="text-xs gap-1"
            >
              Lihat Laporan
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={SALES_7_DAYS}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(25, 70%, 38%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(25, 70%, 38%)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val / 1000}k`}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatRupiah(Number(value)), 'Penjualan']}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return `${payload[0].payload.date} (${label})`;
                      }
                      return label;
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                    itemStyle={{
                      color: '#ea580c',
                      fontWeight: 'bold',
                    }}
                    labelStyle={{
                      color: 'hsl(var(--foreground))',
                      fontWeight: '600',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(25, 70%, 38%)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Shift & Quick Stats (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Shift Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold">Status Shift Kasir</CardTitle>
                <Badge variant={activeShift ? 'success' : 'secondary'} className="text-[10px]">
                  {activeShift ? 'Sedang Berjalan' : 'Tutup'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {activeShift ? (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Kasir Bertugas:</span>
                    <span className="font-bold text-foreground">{activeShift.cashierName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Jam Buka:</span>
                    <span className="font-medium text-foreground">{formatTime(activeShift.openedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <span className="text-muted-foreground">Kas Awal Modal:</span>
                    <span className="font-medium text-foreground">{formatRupiah(activeShift.openingCash)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Penjualan Shift:</span>
                    <span className="font-bold text-accent">{formatRupiah(activeShift.totalSales)}</span>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  Tidak ada shift yang sedang terbuka saat ini.
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate('/shift')}
              >
                Lihat Riwayat Semua Shift
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Menu Links */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Akses Cepat</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              <button
                type="button"
                onClick={() => navigate('/inventaris/baru')}
                className="w-full text-left p-2 rounded-lg hover:bg-secondary flex items-center justify-between text-xs text-foreground transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="font-medium">Tambah Produk Baru</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/inventaris/stok-masuk')}
                className="w-full text-left p-2 rounded-lg hover:bg-secondary flex items-center justify-between text-xs text-foreground transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">Catat Stok Masuk</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/laporan/biaya')}
                className="w-full text-left p-2 rounded-lg hover:bg-secondary flex items-center justify-between text-xs text-foreground transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                  <span className="font-medium">Catat Biaya Operasional</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Transaksi Terbaru Table */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
            <CardDescription>5 transaksi terakhir yang tercatat di sistem</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/transaksi')}
            className="text-xs"
          >
            Semua Transaksi
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs text-muted-foreground uppercase border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">No Invoice</th>
                  <th className="px-4 py-3 text-left font-semibold">Waktu</th>
                  <th className="px-4 py-3 text-left font-semibold">Kasir</th>
                  <th className="px-4 py-3 text-left font-semibold">Pelanggan</th>
                  <th className="px-4 py-3 text-left font-semibold">Metode</th>
                  <th className="px-4 py-3 text-right font-semibold">Total Tagihan</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_SALES.slice(0, 5).map((sale) => (
                  <tr
                    key={sale.id}
                    onClick={() => navigate(`/transaksi/${sale.invoiceNo}`)}
                    className="hover:bg-secondary/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-medium text-xs text-primary">
                      {sale.invoiceNo}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatTime(sale.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-foreground">
                      {sale.cashierName}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {sale.customerName || 'Umum'}
                    </td>
                    <td className="px-4 py-3 text-xs uppercase font-medium">
                      {sale.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-xs tabular-nums text-foreground">
                      {formatRupiah(sale.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={
                          sale.status === 'lunas'
                            ? 'success'
                            : sale.status === 'pending'
                            ? 'warning'
                            : 'secondary'
                        }
                        className="text-[10px]"
                      >
                        {sale.status === 'lunas'
                          ? 'Lunas'
                          : sale.status === 'pending'
                          ? 'Pending'
                          : 'Batal'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

