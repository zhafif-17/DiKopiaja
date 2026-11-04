import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowDownToLine,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface StockEntryItem {
  id: string;
  productId: string;
  qty: number;
}

export const StokMasukPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invoiceRef, setInvoiceRef] = useState('FAK-SUP-20251101');
  const [supplierName, setSupplierName] = useState('PT Roaster Nusantara Mandiri');
  const [note, setNote] = useState('');
  const [entryItems, setEntryItems] = useState<StockEntryItem[]>([
    { id: '1', productId: 'prod-001', qty: 20 },
    { id: '2', productId: 'prod-002', qty: 15 },
  ]);

  const handleAddItem = () => {
    setEntryItems([
      ...entryItems,
      { id: String(Date.now()), productId: MOCK_PRODUCTS[0].id, qty: 10 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (entryItems.length <= 1) return;
    setEntryItems(entryItems.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: 'productId' | 'qty', value: any) => {
    setEntryItems(
      entryItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceRef.trim()) {
      toast({
        title: 'Nomor Faktur Wajib',
        description: 'Masukkan nomor faktur atau surat jalan dari pemasok.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Stok Masuk Tersimpan',
      description: `Berhasil menambahkan ${entryItems.reduce((s, i) => s + i.qty, 0)} item ke inventaris.`,
      variant: 'success',
    });
    navigate('/inventaris');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => navigate('/inventaris')}
          aria-label="Kembali"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Pencatatan Stok Masuk (Restok)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tambah kuantitas persediaan barang yang dikirim oleh supplier ke kedai.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Informasi Faktur Pemasok</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="invoiceRef">Nomor Faktur / Surat Jalan</Label>
                <Input
                  id="invoiceRef"
                  placeholder="Contoh: FAK-SUP-00129"
                  value={invoiceRef}
                  onChange={(e) => setInvoiceRef(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="supplier">Nama Supplier / Pemasok</Label>
                <Input
                  id="supplier"
                  placeholder="Contoh: CV Biji Kopi Gayo"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="note">Catatan Tambahan (Opsional)</Label>
                <Textarea
                  id="note"
                  placeholder="Contoh: Pengiriman batch biji sangrai minggu pertama..."
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-item Input Table */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Daftar Produk Masuk</CardTitle>
              <CardDescription>
                Pilih menu dan masukkan jumlah kuantitas yang diterima.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="gap-1.5 text-xs"
            >
              <Plus className="h-4 w-4" />
              Tambah Baris
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {entryItems.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-3 items-end p-3 rounded-xl border border-border bg-secondary/20"
              >
                <div className="flex-1 w-full space-y-1.5">
                  <Label className="text-xs">Produk #{index + 1}</Label>
                  <Select
                    value={item.productId}
                    onValueChange={(val) => handleUpdateItem(item.id, 'productId', val)}
                  >
                    <SelectTrigger className="h-10 text-xs">
                      <SelectValue placeholder="Pilih Produk" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_PRODUCTS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} ({p.sku}) - Sisa Stok: {p.stock}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-32 space-y-1.5">
                  <Label className="text-xs">Qty Masuk</Label>
                  <Input
                    type="number"
                    min="1"
                    className="h-10 text-xs tabular-nums font-bold"
                    value={item.qty}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))
                    }
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={entryItems.length <= 1}
                  className="hover:text-destructive h-10 w-10 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Total Barang Masuk:{' '}
              <strong className="text-foreground">
                {entryItems.reduce((s, i) => s + i.qty, 0)} item
              </strong>
            </span>
            <Button type="submit" className="gap-2 font-bold">
              <CheckCircle2 className="h-4 w-4" />
              Simpan Stok Masuk
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

