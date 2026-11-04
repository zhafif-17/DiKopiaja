import React, { useState } from 'react';
import {
  History,
  Printer,
  Ban,
  Search,
  Filter,
  Receipt,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_SALES, type Sale } from '@/mocks/sales';
import { formatRupiah, formatTime, getSaleStatusLabel, getSaleStatusVariant } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ReceiptPreview, type ReceiptData } from '@/components/receipt/ReceiptPreview';

export const RiwayatPage: React.FC = () => {
  const { toast } = useToast();
  const [salesList, setSalesList] = useState<Sale[]>(
    MOCK_SALES.filter((s) => s.shiftId === 'shift-005')
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Reprint Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);

  // Cancel Transaction Modal State
  const [cancelModalSale, setCancelModalSale] = useState<Sale | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState('');

  const filteredSales = salesList.filter(
    (s) =>
      s.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.customerName && s.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenReprint = (sale: Sale) => {
    const data: ReceiptData = {
      invoiceNo: sale.invoiceNo,
      cashierName: sale.cashierName,
      createdAt: sale.createdAt,
      items: sale.items.map((it) => ({
        productId: it.productId,
        sku: it.skuSnapshot,
        name: it.productNameSnapshot,
        unitPrice: it.unitPrice,
        costPrice: it.costPriceSnapshot,
        qty: it.qty,
        discountAmount: it.discountAmount,
        subtotal: it.subtotal,
        maxStock: 99,
      })),
      subtotal: sale.subtotal,
      itemDiscountTotal: sale.itemDiscountTotal,
      memberDiscount: sale.memberDiscount,
      voucherDiscount: sale.voucherDiscount,
      pointRedeemValue: sale.pointRedeemValue,
      taxAmount: sale.taxAmount,
      total: sale.total,
      paymentMethod: sale.paymentMethod,
      amountPaid: sale.amountPaid,
      changeAmount: sale.changeAmount,
      pointEarned: sale.pointEarned,
      isCopy: true,
    };
    setSelectedReceipt(data);
  };

  const handleConfirmCancel = () => {
    if (!cancelReasonInput.trim()) {
      toast({
        title: 'Alasan Wajib Diisi',
        description: 'Tuliskan alasan pembatalan transaksi untuk pencatatan audit.',
        variant: 'destructive',
      });
      return;
    }

    if (cancelModalSale) {
      setSalesList((prev) =>
        prev.map((s) =>
          s.id === cancelModalSale.id
            ? {
                ...s,
                status: 'dibatalkan',
                cancelReason: cancelReasonInput,
              }
            : s
        )
      );
      toast({
        title: 'Transaksi Dibatalkan',
        description: `Invoice ${cancelModalSale.invoiceNo} telah berhasil dibatalkan.`,
        variant: 'destructive',
      });
      setCancelModalSale(null);
      setCancelReasonInput('');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Riwayat Transaksi Shift Saya
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Daftar seluruh transaksi yang Anda buat selama shift aktif saat ini.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari No Invoice..."
              className="pl-9 h-10 text-xs bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead className="text-right">Total Tagihan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Tidak ada transaksi pada shift ini.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-mono font-medium text-xs">
                      {sale.invoiceNo}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatTime(sale.createdAt)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {sale.customerName ? (
                        <span className="font-medium text-foreground">
                          {sale.customerName}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Umum</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs uppercase font-medium">
                      {sale.paymentMethod}
                    </TableCell>
                    <TableCell className="text-right font-bold text-xs tabular-nums text-foreground">
                      {formatRupiah(sale.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSaleStatusVariant(sale.status)}>
                        {getSaleStatusLabel(sale.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Cetak Ulang Struk"
                        onClick={() => handleOpenReprint(sale)}
                      >
                        <Printer className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      {sale.status === 'lunas' && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Batalkan Transaksi"
                          className="hover:text-destructive"
                          onClick={() => {
                            setCancelModalSale(sale);
                            setCancelReasonInput('');
                          }}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= MODAL CETAK ULANG STRUK ================= */}
      <Dialog
        open={selectedReceipt !== null}
        onOpenChange={(open) => !open && setSelectedReceipt(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cetak Ulang Struk</DialogTitle>
            <DialogDescription>
              Struk akan dicetak dengan tanda status COPY.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-72 overflow-y-auto border border-border rounded-xl p-2 bg-white text-left scrollbar-thin">
            {selectedReceipt && <ReceiptPreview data={selectedReceipt} />}
          </div>

          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={() => setSelectedReceipt(null)}>
              Tutup
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                window.print();
              }}
            >
              <Printer className="h-4 w-4" />
              Cetak ke Printer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL BATALKAN TRANSAKSI ================= */}
      <Dialog
        open={cancelModalSale !== null}
        onOpenChange={(open) => !open && setCancelModalSale(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Batalkan Transaksi
            </DialogTitle>
            <DialogDescription>
              Transaksi invoice{' '}
              <strong className="font-mono text-foreground">
                {cancelModalSale?.invoiceNo}
              </strong>{' '}
              sebesar {formatRupiah(cancelModalSale?.total || 0)} akan dibatalkan.
              Stok akan dikembalikan dan poin pelanggan akan ditarik.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="cancelReason">Alasan Pembatalan (Wajib)</Label>
              <Textarea
                id="cancelReason"
                placeholder="Contoh: Salah pilih item, pelanggan membatalkan pesanan, dll."
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                rows={3}
              />
            </div>
            {cancelModalSale?.paymentMethod !== 'tunai' && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                Perhatian: Untuk transaksi non-tunai (Midtrans), pengembalian dana (refund)
                harus diproses secara manual oleh Owner di dashboard Midtrans.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModalSale(null)}>
              Kembali
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Ya, Batalkan Transaksi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

