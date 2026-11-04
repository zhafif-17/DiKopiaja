import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Package,
  Barcode,
  DollarSign,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  History,
  Layers,
} from 'lucide-react';
import { MOCK_PRODUCTS, type Product } from '@/mocks/products';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import { formatRupiah, formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const productSchema = z.object({
  name: z.string().min(2, 'Nama produk minimal 2 karakter'),
  sku: z.string().min(3, 'SKU minimal 3 karakter'),
  barcode: z.string().optional(),
  categoryId: z.number().min(1, 'Pilih kategori produk'),
  costPrice: z.number().min(0, 'Harga pokok minimal Rp 0'),
  sellPrice: z.number().min(0, 'Harga jual minimal Rp 0'),
  stock: z.number().min(0, 'Stok awal minimal 0'),
  minStock: z.number().min(0, 'Stok minimum minimal 0'),
  allowNegativeStock: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const ProdukFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const existingProduct = isEdit
    ? MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0]
    : null;

  const [allowNegative, setAllowNegative] = useState(
    existingProduct ? existingProduct.allowNegativeStock : false
  );
  const [selectedCat, setSelectedCat] = useState<number>(
    existingProduct ? existingProduct.categoryId : 1
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: existingProduct?.name || '',
      sku: existingProduct?.sku || '',
      barcode: existingProduct?.barcode || '',
      categoryId: existingProduct?.categoryId || 1,
      costPrice: existingProduct?.costPrice || 0,
      sellPrice: existingProduct?.sellPrice || 0,
      stock: existingProduct?.stock || 0,
      minStock: existingProduct?.minStock || 5,
      allowNegativeStock: existingProduct?.allowNegativeStock || false,
    },
  });

  const costPrice = watch('costPrice') || 0;
  const sellPrice = watch('sellPrice') || 0;
  const isLossSelling = sellPrice > 0 && sellPrice < costPrice;

  // Mock Stock Movements for Edit Page
  const mockMovements = [
    {
      id: 'mov-1',
      type: 'penjualan',
      qty: -2,
      stockAfter: existingProduct?.stock || 45,
      note: 'Transaksi DKP-20250814-0021',
      date: new Date(Date.now() - 30 * 60000).toISOString(),
    },
    {
      id: 'mov-2',
      type: 'stok_masuk',
      qty: 20,
      stockAfter: (existingProduct?.stock || 45) + 2,
      note: 'Faktur Supplier #SUP-8812',
      date: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
      id: 'mov-3',
      type: 'penyesuaian',
      qty: -1,
      stockAfter: (existingProduct?.stock || 45) - 18,
      note: 'Koreksi stock opname mingguan',
      date: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    },
  ];

  const onSubmit = (data: ProductFormValues) => {
    toast({
      title: isEdit ? 'Produk Berhasil Diperbarui' : 'Produk Berhasil Ditambahkan',
      description: `Data untuk ${data.name} telah disimpan ke inventaris.`,
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
            {isEdit ? 'Edit Data Produk' : 'Tambah Produk Baru'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEdit
              ? `Perbarui informasi dan pantau pergerakan stok untuk ${existingProduct?.name}`
              : 'Tambahkan menu minuman, makanan ringan, atau biji kopi baru ke sistem POS.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Informasi Utama Produk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Warning Jual Rugi */}
            {isLossSelling && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                <div>
                  <span className="font-bold">Peringatan: Produk Dijual Rugi!</span>
                  <p className="mt-0.5">
                    Harga jual ({formatRupiah(sellPrice)}) lebih rendah dari harga pokok ({formatRupiah(costPrice)}).
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name">Nama Menu / Produk</Label>
                <Input
                  id="name"
                  placeholder="Contoh: Kopi Susu Gula Aren"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sku">SKU (Kode Unik Produk)</Label>
                <Input
                  id="sku"
                  placeholder="Contoh: KS-001"
                  className="font-mono uppercase"
                  {...register('sku')}
                />
                {errors.sku && (
                  <p className="text-xs text-destructive">{errors.sku.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="barcode">Barcode (Opsional)</Label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="barcode"
                    placeholder="Scan atau ketik barcode..."
                    className="pl-9 font-mono"
                    {...register('barcode')}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="category">Kategori Menu</Label>
                <Select
                  value={String(selectedCat)}
                  onValueChange={(val) => setSelectedCat(Number(val))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="costPrice">Harga Pokok (HPP) Rupiah</Label>
                <Input
                  id="costPrice"
                  type="number"
                  placeholder="6500"
                  {...register('costPrice', { valueAsNumber: true })}
                />
                {errors.costPrice && (
                  <p className="text-xs text-destructive">{errors.costPrice.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sellPrice">Harga Jual Kasir Rupiah</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  placeholder="18000"
                  {...register('sellPrice', { valueAsNumber: true })}
                />
                {errors.sellPrice && (
                  <p className="text-xs text-destructive">{errors.sellPrice.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stock">Stok Awal Fisik</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="45"
                  {...register('stock', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="minStock">Batas Minimum Peringatan</Label>
                <Input
                  id="minStock"
                  type="number"
                  placeholder="10"
                  {...register('minStock', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Toggle Allow Negative Stock */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-foreground">
                  Izinkan Stok Minus
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Tetap dapat dijual di kasir meskipun perhitungan stok fisik di sistem menunjukkan 0.
                </div>
              </div>
              <Switch checked={allowNegative} onCheckedChange={setAllowNegative} />
            </div>

            {/* Upload Area Mock */}
            <div className="pt-3 border-t border-border space-y-1.5">
              <Label>Foto Menu Produk (Maks 2MB)</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-secondary/20 cursor-pointer transition-colors">
                <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <span className="text-xs font-semibold text-foreground block">
                  Klik untuk unggah atau seret file gambar ke sini
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Mendukung format JPG, PNG, atau WebP (akan dikompresi otomatis)
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/inventaris')}
            >
              Batal
            </Button>
            <Button type="submit" className="font-bold">
              {isEdit ? 'Simpan Perubahan' : 'Buat Produk Baru'}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Jika Edit Mode: Riwayat Pergerakan Stok */}
      {isEdit && (
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Riwayat Pergerakan Stok (Stock Movements)</CardTitle>
            </div>
            <CardDescription>
              Log audit setiap pengurangan penjualan, penambahan stok masuk, dan penyesuaian.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Jenis Mutasi</TableHead>
                  <TableHead className="text-right">Perubahan Qty</TableHead>
                  <TableHead className="text-right">Sisa Stok Akhir</TableHead>
                  <TableHead>Keterangan / Referensi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMovements.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(mov.date)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          mov.type === 'penjualan'
                            ? 'default'
                            : mov.type === 'stok_masuk'
                            ? 'success'
                            : 'warning'
                        }
                        className="capitalize text-[10px]"
                      >
                        {mov.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right text-xs font-bold tabular-nums ${
                        mov.qty > 0 ? 'text-accent' : 'text-foreground'
                      }`}
                    >
                      {mov.qty > 0 ? `+${mov.qty}` : mov.qty}
                    </TableCell>
                    <TableCell className="text-right text-xs font-semibold tabular-nums text-foreground">
                      {mov.stockAfter}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {mov.note}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
