import React, { useState } from 'react';
import {
  Ticket,
  Plus,
  Percent,
  Sliders,
  Calendar,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { MOCK_VOUCHERS, type Voucher, type VoucherType } from '@/mocks/vouchers';
import { formatRupiah, formatDate, cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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

export const VoucherPage: React.FC = () => {
  const { toast } = useToast();
  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form states for new voucher
  const [code, setCode] = useState('');
  const [type, setType] = useState<VoucherType>('persen');
  const [value, setValue] = useState<number>(10);
  const [minPurchase, setMinPurchase] = useState<number>(50000);
  const [maxDiscount, setMaxDiscount] = useState<number>(15000);
  const [quota, setQuota] = useState<number>(100);

  // Member Tier Diskon Settings
  const [silverDiscount, setSilverDiscount] = useState<number>(5);
  const [goldDiscount, setGoldDiscount] = useState<number>(10);

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast({
        title: 'Kode Voucher Wajib',
        description: 'Tuliskan kode voucher baru.',
        variant: 'destructive',
      });
      return;
    }

    const newVoucher: Voucher = {
      id: `voucher-${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value,
      minPurchase,
      maxDiscount: type === 'persen' ? maxDiscount : undefined,
      quota,
      usedCount: 0,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 30 * 24 * 3600000).toISOString(),
      isActive: true,
    };

    setVouchers([newVoucher, ...vouchers]);
    toast({
      title: 'Voucher Dibuat',
      description: `Kode voucher ${newVoucher.code} berhasil dipublikasikan.`,
      variant: 'success',
    });
    setDialogOpen(false);
    setCode('');
  };

  const handleToggleVoucher = (id: string) => {
    setVouchers(
      vouchers.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  const handleSaveTierDiscounts = () => {
    toast({
      title: 'Pengaturan Diskon Member Disimpan',
      description: `Silver: ${silverDiscount}% • Gold: ${goldDiscount}%`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Voucher & Diskon Loyalitas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Buat kode kupon promo dan atur persentase diskon otomatis per tier member.
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)} className="gap-2 text-xs font-bold shadow-sm">
          <Plus className="h-4 w-4" />
          Buat Voucher Baru
        </Button>
      </div>

      {/* Panel Pengaturan Diskon Tier Member */}
      <Card className="shadow-sm border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Percent className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Pengaturan Diskon Otomatis Tier Member</CardTitle>
          </div>
          <CardDescription>
            Diskon otomatis terpotong saat kasir memilih member di layar kasir POS tanpa kode voucher.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-card rounded-xl border border-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-foreground">Member Silver</span>
              <Badge variant="secondary">Silver</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={silverDiscount}
                onChange={(e) => setSilverDiscount(Number(e.target.value))}
                className="h-9 w-24 text-center font-bold"
              />
              <span className="text-sm font-semibold">% Diskon Otomatis</span>
            </div>
          </div>

          <div className="p-3 bg-card rounded-xl border border-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-foreground">Member Gold</span>
              <Badge variant="warning">Gold</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={goldDiscount}
                onChange={(e) => setGoldDiscount(Number(e.target.value))}
                className="h-9 w-24 text-center font-bold"
              />
              <span className="text-sm font-semibold">% Diskon Otomatis</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-end">
          <Button size="sm" onClick={handleSaveTierDiscounts}>
            Simpan Aturan Diskon Member
          </Button>
        </CardFooter>
      </Card>

      {/* Tabel Voucher */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Daftar Kode Voucher Promo</CardTitle>
          <CardDescription>
            Kupon aktif yang dapat dimasukkan oleh kasir saat melayani transaksi.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Kupon</TableHead>
                <TableHead>Potongan</TableHead>
                <TableHead>Min. Belanja</TableHead>
                <TableHead className="text-center">Kuota Terpakai</TableHead>
                <TableHead>Masa Berlaku</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono font-bold text-sm text-primary">
                    <div className="flex items-center space-x-1.5">
                      <Ticket className="h-4 w-4" />
                      <span>{v.code}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-semibold text-foreground">
                    {v.type === 'persen' ? (
                      <span>
                        Diskon {v.value}%{' '}
                        {v.maxDiscount && (
                          <span className="text-muted-foreground font-normal">
                            (Maks {formatRupiah(v.maxDiscount)})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span>Potongan {formatRupiah(v.value)}</span>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground tabular-nums">
                    {formatRupiah(v.minPurchase)}
                  </TableCell>

                  <TableCell className="text-center text-xs tabular-nums">
                    <span className="font-bold text-foreground">{v.usedCount}</span> / {v.quota}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    s/d {formatDate(v.endsAt)}
                  </TableCell>

                  <TableCell>
                    <Badge variant={v.isActive ? 'success' : 'secondary'}>
                      {v.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Switch
                      checked={v.isActive}
                      onCheckedChange={() => handleToggleVoucher(v.id)}
                      className={!v.isActive ? "data-[state=unchecked]:bg-red-500" : ""}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Buat Voucher */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Kode Voucher Baru</DialogTitle>
            <DialogDescription>
              Atur nominal potongan, syarat minimum belanja, dan batas kuota.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateVoucher} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="vCode">Kode Voucher (Kapital)</Label>
              <Input
                id="vCode"
                placeholder="Contoh: KOPIHEMAT20"
                className="uppercase font-mono font-bold"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Jenis Potongan</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={type === 'persen' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setType('persen')}
                  >
                    Persen (%)
                  </Button>
                  <Button
                    type="button"
                    variant={type === 'nominal' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setType('nominal')}
                  >
                    Nominal (Rp)
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>{type === 'persen' ? 'Nilai Persen (%)' : 'Nilai Potongan (Rp)'}</Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                />
              </div>
            </div>

            {type === 'persen' && (
              <div className="space-y-1.5">
                <Label>Maksimal Potongan (Rp)</Label>
                <Input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Minimum Belanja (Rp)</Label>
                <Input
                  type="number"
                  value={minPurchase}
                  onChange={(e) => setMinPurchase(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Kuota Penggunaan</Label>
                <Input
                  type="number"
                  value={quota}
                  onChange={(e) => setQuota(Number(e.target.value))}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Terbitkan Voucher</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

