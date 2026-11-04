import React, { useState } from 'react';
import {
  Clock,
  Banknote,
  TrendingUp,
  CreditCard,
  QrCode,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Receipt,
  FileText,
} from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';
import { MOCK_SHIFTS } from '@/mocks/shifts';
import { MOCK_SALES } from '@/mocks/sales';
import { formatRupiah, formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export const ShiftPage: React.FC = () => {
  const { toast } = useToast();
  const { currentUser, activeShiftId, setActiveShift } = useSessionStore();

  // Find active shift or fallback
  const currentShift = MOCK_SHIFTS.find((s) => s.id === activeShiftId);

  // Open shift state
  const [openingCashInput, setOpeningCashInput] = useState<number>(300000);

  // Close shift dialog states
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [countedCashInput, setCountedCashInput] = useState<number>(0);
  const [closingNoteInput, setClosingNoteInput] = useState<string>('');

  // Calculate dynamic sales for active shift
  const shiftSales = MOCK_SALES.filter((s) => s.shiftId === 'shift-005' && s.status === 'lunas');
  const cashSales = shiftSales
    .filter((s) => s.paymentMethod === 'tunai')
    .reduce((sum, s) => sum + s.total, 0);
  const qrisSales = shiftSales
    .filter((s) => s.paymentMethod === 'qris')
    .reduce((sum, s) => sum + s.total, 0);
  const cardSales = shiftSales
    .filter((s) => s.paymentMethod === 'kartu')
    .reduce((sum, s) => sum + s.total, 0);
  const ewalletSales = shiftSales
    .filter((s) => s.paymentMethod === 'ewallet')
    .reduce((sum, s) => sum + s.total, 0);

  const totalShiftSales = cashSales + qrisSales + cardSales + ewalletSales;
  const initialCash = currentShift ? currentShift.openingCash : 300000;
  const expectedCash = initialCash + cashSales; // kas awal + tunai masuk
  const difference = countedCashInput - expectedCash;
  const isLargeDifference = Math.abs(difference) > 10000;

  const handleOpenShift = () => {
    if (openingCashInput < 0 || openingCashInput > 10000000) {
      toast({
        title: 'Nominal Tidak Wajar',
        description: 'Kas awal harus antara Rp 0 sampai Rp 10.000.000.',
        variant: 'destructive',
      });
      return;
    }

    setActiveShift('shift-005');
    toast({
      title: 'Shift Berhasil Dibuka',
      description: `Kas awal ${formatRupiah(openingCashInput)} telah dicatat.`,
      variant: 'success',
    });
  };

  const handleCloseShift = () => {
    if (isLargeDifference && !closingNoteInput.trim()) {
      toast({
        title: 'Catatan Selisih Wajib Diisi',
        description: 'Selisih kas melebihi Rp 10.000, mohon berikan alasan penjelas.',
        variant: 'destructive',
      });
      return;
    }

    setActiveShift(null);
    setCloseDialogOpen(false);
    toast({
      title: 'Shift Berhasil Ditutup',
      description: `Shift Anda telah resmi ditutup dengan selisih kas ${formatRupiah(difference)}.`,
      variant: 'success',
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Dashboard Shift Kasir
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola pembukaan kas awal, pemantauan transaksi harian, dan penutupan shift.
          </p>
        </div>

        {activeShiftId ? (
          <Badge variant="success" className="text-sm py-1.5 px-3 gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Shift Sedang Aktif
          </Badge>
        ) : (
          <Badge variant="warning" className="text-sm py-1.5 px-3 gap-2">
            <Clock className="h-4 w-4" />
            Belum Buka Shift
          </Badge>
        )}
      </div>

      {!activeShiftId ? (
        /* ================= STATE BELUM BUKA SHIFT ================= */
        <Card className="max-w-md mx-auto shadow-md border-border">
          <CardHeader className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Unlock className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl">Buka Shift Baru</CardTitle>
            <CardDescription>
              Hitung uang fisik di laci kasir dan masukkan sebagai kas modal awal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="openingCash">Jumlah Uang Kas Awal (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  Rp
                </span>
                <Input
                  id="openingCash"
                  type="number"
                  placeholder="300000"
                  className="pl-10 text-lg font-bold font-mono"
                  value={openingCashInput || ''}
                  onChange={(e) => setOpeningCashInput(Number(e.target.value))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Batas wajar kas awal: Rp 0 sampai Rp 10.000.000.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpeningCashInput(200000)}
              >
                Rp 200k
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpeningCashInput(300000)}
              >
                Rp 300k
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpeningCashInput(500000)}
              >
                Rp 500k
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full gap-2 font-bold" onClick={handleOpenShift}>
              <CheckCircle2 className="h-4 w-4" />
              Buka Shift Sekarang
            </Button>
          </CardFooter>
        </Card>
      ) : (
        /* ================= STATE SHIFT AKTIF ================= */
        <div className="space-y-6">
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card">
              <CardContent className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Kas Modal Awal</span>
                <div className="font-heading font-bold text-xl text-foreground tabular-nums">
                  {formatRupiah(initialCash)}
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Dibuka: {formatDateTime(currentShift?.openedAt || new Date())}
                </span>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Penjualan Tunai</span>
                <div className="font-heading font-bold text-xl text-accent tabular-nums">
                  {formatRupiah(cashSales)}
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Harus ada di laci bersama kas awal
                </span>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="p-4 space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Penjualan Non-Tunai</span>
                <div className="font-heading font-bold text-xl text-primary tabular-nums">
                  {formatRupiah(qrisSales + cardSales + ewalletSales)}
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  QRIS, Kartu Debit, & E-Wallet
                </span>
              </CardContent>
            </Card>

            <Card className="bg-card border-primary/40 bg-primary/5">
              <CardContent className="p-4 space-y-1">
                <span className="text-xs font-semibold text-primary">Kas yang Seharusnya Ada</span>
                <div className="font-heading font-extrabold text-2xl text-primary tabular-nums">
                  {formatRupiah(expectedCash)}
                </div>
                <span className="text-[11px] text-muted-foreground block">
                  Kas Awal + Tunai Masuk
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown Per Metode Pembayaran */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Rincian Penjualan per Metode</CardTitle>
              <CardDescription>
                Akumulasi seluruh transaksi lunas yang dibuat pada shift ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center space-x-3">
                  <Banknote className="h-8 w-8 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Uang Tunai</span>
                    <span className="font-bold text-sm tabular-nums text-foreground">
                      {formatRupiah(cashSales)}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center space-x-3">
                  <QrCode className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">QRIS Snap</span>
                    <span className="font-bold text-sm tabular-nums text-foreground">
                      {formatRupiah(qrisSales)}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Kartu Debit</span>
                    <span className="font-bold text-sm tabular-nums text-foreground">
                      {formatRupiah(cardSales)}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-border bg-secondary/30 flex items-center space-x-3">
                  <Smartphone className="h-8 w-8 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">E-Wallet</span>
                    <span className="font-bold text-sm tabular-nums text-foreground">
                      {formatRupiah(ewalletSales)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-border pt-4">
              <div className="text-xs text-muted-foreground">
                Total Transaksi: <strong className="text-foreground">{shiftSales.length} transaksi</strong> •
                Total Omzet: <strong className="text-foreground">{formatRupiah(totalShiftSales)}</strong>
              </div>
              <Button
                variant="destructive"
                className="gap-2 font-bold"
                onClick={() => {
                  setCountedCashInput(expectedCash);
                  setClosingNoteInput('');
                  setCloseDialogOpen(true);
                }}
              >
                <Lock className="h-4 w-4" />
                Tutup Shift
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ================= MODAL HITUNG KAS & TUTUP SHIFT ================= */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tutup Shift & Rekonsiliasi Kas</DialogTitle>
            <DialogDescription>
              Hitung uang fisik di laci kasir dan catat selisih sebelum mengakhiri jaga.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-secondary/50 border border-border space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kas Awal Modal:</span>
                <span className="font-medium text-foreground">{formatRupiah(initialCash)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Penjualan Tunai:</span>
                <span className="font-medium text-foreground">{formatRupiah(cashSales)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-border text-primary">
                <span>Uang yang Seharusnya Ada:</span>
                <span>{formatRupiah(expectedCash)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="countedCash">Jumlah Uang Kas Fisik Nyata (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  Rp
                </span>
                <Input
                  id="countedCash"
                  type="number"
                  className="pl-10 text-lg font-bold font-mono"
                  value={countedCashInput || ''}
                  onChange={(e) => setCountedCashInput(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Selisih Indicator */}
            <div
              className={`p-3 rounded-xl border flex justify-between items-center ${
                difference === 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <span className="font-semibold text-xs">Selisih Kas:</span>
              <span className="font-heading font-extrabold text-base tabular-nums">
                {difference === 0
                  ? 'Rp 0 (Cocok)'
                  : difference > 0
                  ? `+${formatRupiah(difference)} (Lebih)`
                  : `${formatRupiah(difference)} (Kurang)`}
              </span>
            </div>

            {/* Note required if difference > 10.000 */}
            {isLargeDifference && (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1 text-xs text-destructive font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Catatan Selisih Wajib Diisi (Selisih &gt; Rp 10.000)</span>
                </div>
                <Textarea
                  placeholder="Jelaskan alasan selisih uang kas (misal: uang pecahan kecil, salah kembalian, dll.)..."
                  value={closingNoteInput}
                  onChange={(e) => setClosingNoteInput(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleCloseShift}>
              Konfirmasi & Tutup Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

