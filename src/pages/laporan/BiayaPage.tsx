import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';
import { MOCK_EXPENSES, type Expense } from '@/mocks/expenses';
import { formatRupiah, formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useSessionStore } from '@/store/sessionStore';

export const BiayaPage: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useSessionStore();
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form states
  const [category, setCategory] = useState('Listrik & Utilitas');
  const [amount, setAmount] = useState<number>(50000);
  const [note, setNote] = useState('');

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast({
        title: 'Nominal Tidak Valid',
        description: 'Nominal pengeluaran harus lebih besar dari Rp 0.',
        variant: 'destructive',
      });
      return;
    }

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      category,
      amount,
      note,
      expenseDate: new Date().toISOString(),
      createdBy: currentUser?.id || 'user-001',
      createdByName: currentUser?.name || 'Kasir',
    };

    setExpenses([newExp, ...expenses]);
    toast({
      title: 'Biaya Berhasil Dicatat',
      description: `Pengeluaran ${category} sebesar ${formatRupiah(amount)} telah disimpan.`,
      variant: 'success',
    });

    setDialogOpen(false);
    setAmount(0);
    setNote('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    toast({
      title: 'Biaya Dihapus',
      description: 'Catatan pengeluaran telah dihapus dari sistem.',
      variant: 'default',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Biaya Operasional Toko
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pencatatan pengeluaran harian seperti listrik, air, es batu, dan perlengkapan kedai.
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)} className="gap-2 text-xs font-bold shadow-sm">
          <Plus className="h-4 w-4" />
          Catat Pengeluaran Baru
        </Button>
      </div>

      {/* KPI Total Biaya */}
      <Card className="shadow-sm border-amber-200 bg-amber-50/30">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800">
              Total Seluruh Biaya Operasional Tercatat
            </span>
            <div className="font-heading font-extrabold text-2xl text-amber-900 tabular-nums">
              {formatRupiah(totalExpense)}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategori Biaya</TableHead>
                <TableHead>Waktu & Tanggal</TableHead>
                <TableHead>Dicatat Oleh</TableHead>
                <TableHead>Catatan / Keterangan</TableHead>
                <TableHead className="text-right">Nominal Pengeluaran</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-semibold text-xs text-foreground">
                    {exp.category}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(exp.expenseDate)}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {exp.createdByName}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {exp.note || '-'}
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs tabular-nums text-amber-800">
                    {formatRupiah(exp.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="hover:text-destructive"
                      title="Hapus Biaya"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tambah Biaya */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Catat Biaya Operasional Baru</DialogTitle>
            <DialogDescription>
              Pengeluaran akan langsung mengurangi perhitungan laba bersih harian toko.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Kategori Biaya</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Listrik PLN">Listrik PLN</SelectItem>
                  <SelectItem value="Es Batu dan Sirup">Es Batu dan Sirup</SelectItem>
                  <SelectItem value="Kebersihan">Kebersihan & Sanitasi</SelectItem>
                  <SelectItem value="Transportasi">Transportasi & Pengiriman</SelectItem>
                  <SelectItem value="Bahan Baku">Bahan Baku Tambahan</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expAmount">Nominal Pengeluaran (Rp)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  Rp
                </span>
                <Input
                  id="expAmount"
                  type="number"
                  placeholder="50000"
                  className="pl-9 text-base font-bold tabular-nums"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expNote">Catatan / Keterangan</Label>
              <Textarea
                id="expNote"
                placeholder="Contoh: Beli es batu kristal 2 karung untuk shift siang..."
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan Biaya</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

