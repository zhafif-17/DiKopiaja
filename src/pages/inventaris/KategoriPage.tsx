import React, { useState } from 'react';
import {
  Tags,
  Plus,
  Edit,
  Trash2,
  Package,
} from 'lucide-react';
import { MOCK_CATEGORIES, type Category } from '@/mocks/categories';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useToast } from '@/components/ui/use-toast';

export const KategoriPage: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [nameInput, setNameInput] = useState('');

  const countProductsInCategory = (catId: number) => {
    return MOCK_PRODUCTS.filter((p) => p.categoryId === catId).length;
  };

  const handleOpenAdd = () => {
    setEditCategory(null);
    setNameInput('');
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditCategory(cat);
    setNameInput(cat.name);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!nameInput.trim()) {
      toast({
        title: 'Nama Wajib Diisi',
        description: 'Tuliskan nama kategori baru.',
        variant: 'destructive',
      });
      return;
    }

    if (editCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editCategory.id
            ? { ...c, name: nameInput, slug: nameInput.toLowerCase().replace(/\s+/g, '-') }
            : c
        )
      );
      toast({
        title: 'Kategori Diperbarui',
        description: `Kategori ${nameInput} telah disimpan.`,
        variant: 'success',
      });
    } else {
      const newCat: Category = {
        id: Date.now(),
        name: nameInput,
        slug: nameInput.toLowerCase().replace(/\s+/g, '-'),
      };
      setCategories([...categories, newCat]);
      toast({
        title: 'Kategori Ditambahkan',
        description: `Kategori ${nameInput} berhasil dibuat.`,
        variant: 'success',
      });
    }

    setDialogOpen(false);
  };

  const handleDelete = (cat: Category) => {
    const productCount = countProductsInCategory(cat.id);
    if (productCount > 0) {
      toast({
        title: 'Tidak Dapat Dihapus',
        description: `Kategori "${cat.name}" masih digunakan oleh ${productCount} produk aktif.`,
        variant: 'destructive',
      });
      return;
    }

    setCategories(categories.filter((c) => c.id !== cat.id));
    toast({
      title: 'Kategori Dihapus',
      description: `Kategori ${cat.name} telah dihapus.`,
      variant: 'default',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Kategori Produk
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Atur klasifikasi menu untuk mempermudah pencarian di layar kasir POS.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 text-xs font-bold shadow-sm">
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Slug URL</TableHead>
                <TableHead className="text-center">Jumlah Produk</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => {
                const count = countProductsInCategory(cat.id);
                return (
                  <TableRow key={cat.id}>
                    <TableCell className="font-bold text-xs text-foreground">
                      <div className="flex items-center space-x-2">
                        <Tags className="h-4 w-4 text-primary" />
                        <span>{cat.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {cat.slug}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-semibold text-[10px]">
                        {count} Produk
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEdit(cat)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(cat)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tambah / Edit Kategori */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </DialogTitle>
            <DialogDescription>
              Nama kategori akan muncul sebagai tab menu di layar kasir.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="categoryName">Nama Kategori</Label>
              <Input
                id="categoryName"
                placeholder="Contoh: Pastry & Croissant"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>Simpan Kategori</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

