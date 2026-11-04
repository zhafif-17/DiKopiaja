import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  ArrowDownToLine,
  Search,
  Filter,
  AlertTriangle,
  Edit,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_PRODUCTS, type Product } from '@/mocks/products';
import { MOCK_CATEGORIES } from '@/mocks/categories';
import { formatRupiah } from '@/lib/utils';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const InventarisListPage: React.FC = () => {
  const navigate = useNavigate();
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery));

    const matchCategory =
      categoryFilter === 'all' || p.categoryId === Number(categoryFilter);

    const matchLowStock = !lowStockOnly || p.stock <= p.minStock;

    return matchSearch && matchCategory && matchLowStock;
  });

  const getCategoryName = (id?: number) => {
    return MOCK_CATEGORIES.find((c) => c.id === id)?.name || 'Tanpa Kategori';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Inventaris & Stok Produk
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola katalog menu, pantau stok fisik, dan atur harga jual.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/inventaris/stok-masuk')}
            className="gap-2 text-xs"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Stok Masuk
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/inventaris/baru')}
            className="gap-2 text-xs font-bold"
          >
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama produk, SKU, barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 h-10 text-xs">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {MOCK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={lowStockOnly ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className="gap-1.5 text-xs w-full sm:w-auto"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {lowStockOnly ? 'Tampilkan Semua Stok' : 'Hanya Stok Menipis'}
          </Button>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU & Barcode</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga Pokok</TableHead>
                <TableHead className="text-right">Harga Jual</TableHead>
                <TableHead className="text-center">Sisa Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    Tidak ada produk yang cocok dengan pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const isLow = product.stock <= product.minStock;
                  const isOut = product.stock <= 0;

                  return (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer hover:bg-secondary/30 transition-colors"
                      onClick={() => navigate(`/inventaris/${product.id}`)}
                    >
                      <TableCell className="font-mono text-xs">
                        <div className="font-bold text-foreground">{product.sku}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {product.barcode || '-'}
                        </div>
                      </TableCell>

                      <TableCell className="font-semibold text-xs text-foreground">
                        {product.name}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {getCategoryName(product.categoryId)}
                      </TableCell>

                      <TableCell className="text-right text-xs tabular-nums text-muted-foreground">
                        {formatRupiah(product.costPrice)}
                      </TableCell>

                      <TableCell className="text-right font-bold text-xs tabular-nums text-foreground">
                        {formatRupiah(product.sellPrice)}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          variant={
                            isOut
                              ? 'destructive'
                              : isLow
                              ? 'warning'
                              : 'success'
                          }
                          className="tabular-nums font-bold text-[10px]"
                        >
                          {product.stock} (Min: {product.minStock})
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => navigate(`/inventaris/${product.id}`)}
                          title="Edit Produk"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

