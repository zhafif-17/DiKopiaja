import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Ban,
  Receipt,
  User,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Code2,
} from 'lucide-react';
import { MOCK_SALES } from '@/mocks/sales';
import { formatRupiah, formatDateTime, getSaleStatusLabel, getSaleStatusVariant } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export const TransaksiDetailPage: React.FC = () => {
  const { invoiceNo } = useParams<{ invoiceNo: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [sale, setSale] = useState(
    MOCK_SALES.find((s) => s.invoiceNo === invoiceNo) || MOCK_SALES[0]
  );

  const [reprintOpen, setReprintOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const receiptData: ReceiptData = {
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

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) {
      toast({
        title: 'Alasan Wajib Diisi',
        description: 'Tuliskan alasan pembatalan transaksi.',
        variant: 'destructive',
      });
      return;
    }

    setSale((prev) => ({
      ...prev,
      status: 'dibatalkan',
      cancelReason,
    }));
    setCancelOpen(false);
    toast({
      title: 'Transaksi Dibatalkan',
      description: `Invoice ${sale.invoiceNo} telah resmi dibatalkan.`,
      variant: 'destructive',
    });
  };

  // Mock Midtrans Webhook Log
  const mockWebhookPayload = {
    transaction_time: sale.createdAt,
    transaction_status: sale.status === 'lunas' ? 'settlement' : 'pending',
    transaction_id: 'midtrans-tx-' + sale.id,
    status_message: 'Midtrans payment notification response',
    status_code: '200',
    signature_key: '5b8f9e01a2c3...[SHA512-VERIFIED]',
    payment_type: sale.paymentMethod,
    order_id: `DKP-${sale.invoiceNo}-1730000000`,
    gross_amount: `${sale.total}.00`,
    fraud_status: 'accept',
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => navigate('/transaksi')}
            aria-label="Kembali"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground">
                {sale.invoiceNo}
              </h1>
              <Badge variant={getSaleStatusVariant(sale.status)}>
                {getSaleStatusLabel(sale.status)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Dibuat pada {formatDateTime(sale.createdAt)} oleh kasir {sale.cashierName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReprintOpen(true)}
            className="gap-2 text-xs"
          >
            <Printer className="h-4 w-4" />
            Cetak Ulang Struk
          </Button>

          {sale.status === 'lunas' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCancelOpen(true)}
              className="gap-2 text-xs"
            >
              <Ban className="h-4 w-4" />
              Batalkan Transaksi
            </Button>
          )}
        </div>
      </div>

      {sale.status === 'dibatalkan' && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <div className="font-bold">Transaksi Ini Telah Dibatalkan</div>
            <div className="text-xs mt-0.5">
              Alasan: {sale.cancelReason || 'Dibatalkan oleh kasir/owner.'}
            </div>
          </div>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Item List (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Daftar Item Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-right">Diskon</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-semibold text-xs text-foreground">
                          {item.productNameSnapshot}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          SKU: {item.skuSnapshot}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs font-semibold tabular-nums">
                        {item.qty}
                      </TableCell>
                      <TableCell className="text-right text-xs tabular-nums">
                        {formatRupiah(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right text-xs tabular-nums text-accent">
                        {item.discountAmount > 0 ? `-${formatRupiah(item.discountAmount)}` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-bold text-xs tabular-nums text-foreground">
                        {formatRupiah(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Log Webhook Midtrans Panel */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Log Audit Webhook Gateway Midtrans
                </CardTitle>
              </div>
              <CardDescription>
                Signature SHA512 dan verifikasi idempotensi pembayaran online.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-3 bg-secondary/50 rounded-xl text-[11px] font-mono text-foreground overflow-x-auto border border-border">
                {JSON.stringify(mockWebhookPayload, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Ringkasan Biaya (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-medium text-foreground tabular-nums">
                  {formatRupiah(sale.subtotal)}
                </span>
              </div>

              {sale.itemDiscountTotal > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Diskon Item:</span>
                  <span className="tabular-nums">-{formatRupiah(sale.itemDiscountTotal)}</span>
                </div>
              )}

              {sale.memberDiscount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Diskon Member:</span>
                  <span className="tabular-nums">-{formatRupiah(sale.memberDiscount)}</span>
                </div>
              )}

              {sale.voucherDiscount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Voucher Diskon:</span>
                  <span className="tabular-nums">-{formatRupiah(sale.voucherDiscount)}</span>
                </div>
              )}

              {sale.pointRedeemValue > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Tukar Poin:</span>
                  <span className="tabular-nums">-{formatRupiah(sale.pointRedeemValue)}</span>
                </div>
              )}

              {sale.taxAmount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Pajak Restoran:</span>
                  <span className="tabular-nums">{formatRupiah(sale.taxAmount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-border flex justify-between items-baseline">
                <span className="font-bold text-sm text-foreground">Total:</span>
                <span className="font-heading font-extrabold text-xl text-primary tabular-nums">
                  {formatRupiah(sale.total)}
                </span>
              </div>

              <div className="pt-3 border-t border-border space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Metode:</span>
                  <span className="uppercase font-semibold text-foreground">
                    {sale.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Jumlah Bayar:</span>
                  <span className="tabular-nums text-foreground">
                    {formatRupiah(sale.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kembalian:</span>
                  <span className="tabular-nums text-foreground">
                    {formatRupiah(sale.changeAmount)}
                  </span>
                </div>
                {sale.pointEarned > 0 && (
                  <div className="flex justify-between font-semibold text-emerald-600 pt-1">
                    <span>Poin Diberikan:</span>
                    <span>+{sale.pointEarned} Poin</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Informasi Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama:</span>
                <span className="font-bold text-foreground">
                  {sale.customerName || 'Pelanggan Umum'}
                </span>
              </div>
              {sale.customerName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tier:</span>
                  <Badge variant="warning" className="text-[10px]">
                    Gold Member
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Cetak Ulang Struk */}
      <Dialog open={reprintOpen} onOpenChange={setReprintOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cetak Ulang Struk</DialogTitle>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto border border-border rounded-xl p-2 bg-white text-left scrollbar-thin">
            <ReceiptPreview data={receiptData} />
          </div>
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={() => setReprintOpen(false)}>
              Tutup
            </Button>
            <Button className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Cetak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Batalkan Transaksi */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Konfirmasi Pembatalan Transaksi
            </DialogTitle>
            <DialogDescription>
              Aksi ini akan mengembalikan stok seluruh produk dan menarik kembali poin yang didapat.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Alasan Pembatalan (Wajib)</Label>
              <Textarea
                rows={3}
                placeholder="Tuliskan alasan pembatalan..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Kembali
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              Batalkan Transaksi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

