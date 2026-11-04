import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  KeyRound,
  ShieldCheck,
  PowerOff,
  Power,
  Trash2,
} from 'lucide-react';
import { MOCK_USERS, type MockUser } from '@/mocks/session';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

export const PenggunaPage: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resetModalUser, setResetModalUser] = useState<MockUser | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('kopi1234');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: 'Form Belum Lengkap',
        description: 'Nama dan email kasir wajib diisi.',
        variant: 'destructive',
      });
      return;
    }

    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'kasir',
      mustChangePassword: true,
    };

    setUsers([...users, newUser]);
    toast({
      title: 'Akun Kasir Dibuat',
      description: `Akun untuk ${name} berhasil dibuat dengan password sementara.`,
      variant: 'success',
    });

    setDialogOpen(false);
    setName('');
    setEmail('');
  };

  const handleResetPassword = () => {
    if (resetModalUser) {
      toast({
        title: 'Password Direset',
        description: `Password untuk ${resetModalUser.name} telah direset ke password sementara. Kasir wajib mengganti saat login pertama.`,
        variant: 'success',
      });
      setResetModalUser(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-foreground">
            Manajemen Akun Pengguna & Kasir
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tambah akun kasir baru, reset password, dan nonaktifkan akses staf kedai.
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)} className="gap-2 text-xs font-bold shadow-sm">
          <UserPlus className="h-4 w-4" />
          Tambah Kasir Baru
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Staf</TableHead>
                <TableHead>Email Login</TableHead>
                <TableHead>Peran Akses</TableHead>
                <TableHead>Status Akun</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-semibold text-xs text-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {u.email}
                  </TableCell>

                  <TableCell>
                    <Badge variant={u.role === 'owner' ? 'default' : 'secondary'} className="capitalize">
                      {u.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="success" className="text-[10px]">
                      Aktif
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right space-x-1">
                    {u.role !== 'owner' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setResetModalUser(u)}
                        className="text-xs h-8 gap-1"
                      >
                        <KeyRound className="h-3 w-3" />
                        Reset Password
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tambah Kasir */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Akun Kasir Baru</DialogTitle>
            <DialogDescription>
              Kasir akan diminta mengganti password sementara saat pertama kali login.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="uName">Nama Lengkap Kasir</Label>
              <Input
                id="uName"
                placeholder="Contoh: Fajar Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uEmail">Email Login</Label>
              <Input
                id="uEmail"
                type="email"
                placeholder="fajar@kopisenja.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uPassword">Password Sementara</Label>
              <Input
                id="uPassword"
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                className="font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Berikan password sementara ini kepada kasir.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Buat Akun Kasir</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Reset Password */}
      <Dialog open={resetModalUser !== null} onOpenChange={(open) => !open && setResetModalUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Password Kasir</DialogTitle>
            <DialogDescription>
              Reset password untuk <strong>{resetModalUser?.name}</strong>? Password akan dikembalikan ke default: <code className="font-mono font-bold">kopi1234</code>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetModalUser(null)}>
              Batal
            </Button>
            <Button onClick={handleResetPassword}>
              Konfirmasi Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

