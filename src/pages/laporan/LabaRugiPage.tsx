import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  CreditCard,
  Banknote,
  QrCode,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Hourly sales distribution dummy
const HOURLY_SALES = [
  { hour: '07:00', total: 180000, qty: 10 },
  { hour: '08:00', total: 320000, qty: 18 },
  { hour: '09:00', total: 240000, qty: 14 },
  { hour: '10:00', total: 190000, qty: 11 },
  { hour: '11:00', total: 150000, qty: 8 },
  { hour: '12:00', total: 420000, qty: 22 },
  { hour: '13:00', total: 380000, qty: 20 },
  { hour: '14:00', total: 210000, qty: 12 },
  { hour: '15:00', total: 290000, qty: 16 },
  { hour: '16:00', total: 170000, qty: 9 },
  { hour: '17:00', total: 297000, qty: 17 },
];

export const LabaRugiPage: React.FC = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Financial Figures (Dummy)
  const grossIncome = 2847000;
  const discountsTotal = 152000;
  const netSales = grossIncome - discountsTotal; // 2.695.000
  const cogsHPP = 1120000; // Harga Pokok Penjualan
  const grossProfit = netSales - cogsHPP; // 1.575.000
  const operationalExpenses = 450000; // Biaya operasional
  const netProfit = grossProfit - operationalExpenses; // 1.125.000

  const handleExportCSV = () => {
    const headers = 'Waktu,Pendapatan Kotor,Diskon,HPP,Biaya Operasional,Laba Bersih\n';
    const row = `${selectedDate},${grossIncome},${discountsTotal},${cogsHPP},${operationalExpenses},${netProfit}\n`;
    const blob = new Blob([headers + row], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-laba-rugi-${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Ekspor CSV Berhasil',
      description: `File laporan-laba-rugi-${selectedDate}.csv berhasil diunduh.`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Date Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Laporan Laba-Rugi Harian
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Analisis pendapatan bersih, HPP barang terjual, biaya operasional, dan laba bersih riil.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            type="date"
            className="w-auto h-9 text-xs"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 text-xs"
          >
            <Download className="h-4 w-4" />
            Ekspor CSV
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">
              Penjualan Bersih
            </span>
            <div className="font-heading font-extrabold text-2xl text-foreground tabular-nums">
              {formatRupiah(netSales)}
            </div>
            <span className="text-[11px] text-muted-foreground block">
              Setelah potongan diskon {formatRupiah(discountsTotal)}
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">
              Harga Pokok Penjualan (HPP)
            </span>
            <div className="font-heading font-extrabold text-2xl text-muted-foreground tabular-nums">
              {formatRupiah(cogsHPP)}
            </div>
            <span className="text-[11px] text-muted-foreground block">
              Biaya modal bahan baku menu terjual
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs text-muted-foreground font-semibold">
              Total Biaya Operasional
            </span>
            <div className="font-heading font-extrabold text-2xl text-amber-700 tabular-nums">
              {formatRupiah(operationalExpenses)}
            </div>
            <span className="text-[11px] text-muted-foreground block">
              Listrik, kebersihan, es batu, & belanja
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-emerald-300 bg-emerald-50/50">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-bold text-emerald-800">
              Laba Bersih Riil (Net Profit)
            </span>
            <div className="font-heading font-extrabold text-2xl text-emerald-700 tabular-nums">
              {formatRupiah(netProfit)}
            </div>
            <span className="text-[11px] text-emerald-800/80 font-medium block">
              Laba kotor dikurangi seluruh operasional
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Sales Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Pola Penjualan per Jam ({selectedDate})</CardTitle>
          </div>
          <CardDescription>
            Mengetahui jam-jam sibuk kedai kopi untuk optimasi jadwal kerja kasir dan barista.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_SALES} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: any) => [formatRupiah(Number(val)), 'Omzet']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="total" fill="hsl(25, 70%, 38%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Rincian Finansial Tabel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Rincian Perhitungan Laba-Rugi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border">
              <span className="text-muted-foreground font-medium">Pendapatan Kotor:</span>
              <span className="font-bold text-foreground tabular-nums">{formatRupiah(grossIncome)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border text-accent">
              <span>(-) Total Diskon Member & Voucher:</span>
              <span className="tabular-nums">-{formatRupiah(discountsTotal)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border font-bold text-foreground">
              <span>Penjualan Bersih:</span>
              <span className="tabular-nums">{formatRupiah(netSales)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border text-muted-foreground">
              <span>(-) Harga Pokok Penjualan (HPP):</span>
              <span className="tabular-nums">-{formatRupiah(cogsHPP)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border font-bold text-primary">
              <span>(=) Laba Kotor:</span>
              <span className="tabular-nums">{formatRupiah(grossProfit)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border text-amber-700">
              <span>(-) Biaya Operasional Toko:</span>
              <span className="tabular-nums">-{formatRupiah(operationalExpenses)}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-border font-extrabold text-sm text-emerald-700">
              <span>(=) Laba Bersih Toko:</span>
              <span className="tabular-nums">{formatRupiah(netProfit)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Per Metode */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Pendapatan per Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <Banknote className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Tunai (Cash di Laci)</span>
              </div>
              <span className="font-bold tabular-nums">{formatRupiah(1350000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <QrCode className="h-4 w-4 text-primary" />
                <span className="font-medium">QRIS Midtrans</span>
              </div>
              <span className="font-bold tabular-nums">{formatRupiah(890000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Kartu Debit</span>
              </div>
              <span className="font-bold tabular-nums">{formatRupiah(380000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-amber-600" />
                <span className="font-medium">E-Wallet (GoPay, OVO, ShopeePay)</span>
              </div>
              <span className="font-bold tabular-nums">{formatRupiah(227000)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

