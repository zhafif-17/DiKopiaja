import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  Award,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { MOCK_CUSTOMERS, type Customer, type MemberTier } from '@/mocks/customers';
import { formatRupiah, getTierLabel, getTierColor } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export const PelangganListPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Add customer modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !phoneInput.trim()) {
      toast({
        title: 'Form Belum Lengkap',
        description: 'Nama dan nomor telepon pelanggan wajib diisi.',
        variant: 'destructive',
      });
      return;
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: nameInput,
      phone: phoneInput,
      email: emailInput || undefined,
      tier: 'reguler',
      points: 0,
      totalSpent: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setCustomers([newCustomer, ...customers]);
    toast({
      title: 'Pelanggan Terdaftar',
      description: `${nameInput} berhasil ditambahkan sebagai member baru.`,
      variant: 'success',
    });

    setAddModalOpen(false);
    setNameInput('');
    setPhoneInput('');
    setEmailInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Manajemen Member Pelanggan
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Daftar member kedai, akumulasi belanja, tier loyalti, dan saldo poin.
          </p>
        </div>

        <Button onClick={() => setAddModalOpen(true)} className="gap-2 text-xs font-bold shadow-sm">
          <UserPlus className="h-4 w-4" />
          Daftar Member Baru
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau nomor telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
          </div>

          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-full sm:w-48 h-10 text-xs">
              <SelectValue placeholder="Semua Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tier</SelectItem>
              <SelectItem value="reguler">Tier Reguler</SelectItem>
              <SelectItem value="silver">Tier Silver</SelectItem>
              <SelectItem value="gold">Tier Gold</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pelanggan</TableHead>
                <TableHead>Kontak Telepon</TableHead>
                <TableHead>Tier Member</TableHead>
                <TableHead className="text-right">Saldo Poin</TableHead>
                <TableHead className="text-right">Total Belanja</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Tidak ada pelanggan yang cocok dengan pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((cust) => (
                  <TableRow
                    key={cust.id}
                    className="cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => navigate(`/pelanggan/${cust.id}`)}
                  >
                    <TableCell className="font-semibold text-xs text-foreground">
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <div>{cust.name}</div>
                          {cust.email && (
                            <div className="text-[10px] text-muted-foreground font-normal">
                              {cust.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {cust.phone}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          cust.tier === 'gold'
                            ? 'warning'
                            : cust.tier === 'silver'
                            ? 'secondary'
                            : 'default'
                        }
                        className="capitalize font-bold text-[10px]"
                      >
                        {getTierLabel(cust.tier)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-bold text-xs tabular-nums text-foreground">
                      {cust.points} Poin
                    </TableCell>

                    <TableCell className="text-right font-semibold text-xs tabular-nums text-primary">
                      {formatRupiah(cust.totalSpent)}
                    </TableCell>

                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => navigate(`/pelanggan/${cust.id}`)}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tambah Pelanggan */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Daftarkan Pelanggan Member Baru</DialogTitle>
            <DialogDescription>
              Pelanggan baru akan otomatis mendapatkan status Tier Reguler.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCustomer} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="custName">Nama Lengkap</Label>
              <Input
                id="custName"
                placeholder="Contoh: Sari Wulandari"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="custPhone">Nomor WhatsApp / Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="custPhone"
                  placeholder="081234567890"
                  className="pl-9 font-mono"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="custEmail">Email (Opsional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="custEmail"
                  type="email"
                  placeholder="pelanggan@email.com"
                  className="pl-9"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Daftarkan Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

