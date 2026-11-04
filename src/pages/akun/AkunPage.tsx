import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export const AkunPage: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useSessionStore();

  const [name, setName] = useState(currentUser?.name || "Muhammad Zhafif");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profil Diperbarui",
      description: "Nama profil Anda berhasil disimpan.",
      variant: "success",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast({
        title: "Form Belum Lengkap",
        description: "Masukkan kata sandi lama dan kata sandi baru.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Tidak Cocok",
        description: "Konfirmasi password baru tidak sama.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Terlalu Pendek",
        description: "Password baru minimal harus 8 karakter.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Berhasil Diubah",
      description: "Kata sandi akun Anda telah berhasil diperbarui.",
      variant: "success",
    });

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-foreground">
          Profil Saya & Keamanan Akun
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Perbarui nama akun Anda dan amankan akses dengan mengganti kata sandi.
        </p>
      </div>

      {/* Profil User */}
      <form onSubmit={handleUpdateProfile}>
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base">Informasi Pengguna</CardTitle>
                <CardDescription>
                  Identitas staf yang sedang aktif di sesi ini.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="capitalize text-xs font-semibold"
              >
                Peran: {currentUser?.role || "Owner"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="accName">Nama Lengkap</Label>
              <Input
                id="accName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="accEmail">Alamat Email</Label>
              <Input
                id="accEmail"
                disabled
                value={currentUser?.email || "rangga@kopisenja.id"}
                className="bg-muted text-muted-foreground font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Email digunakan untuk login dan tidak dapat diubah sendiri.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border pt-4">
            <Button type="submit" size="sm">
              Simpan Profil
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Ganti Password */}
      <form onSubmit={handleChangePassword}>
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Ganti Kata Sandi</CardTitle>
            </div>
            <CardDescription>
              Gunakan kombinasi minimal 8 karakter dengan huruf dan angka.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="oldPass">Kata Sandi Lama</Label>
              <Input
                id="oldPass"
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="newPass">Kata Sandi Baru</Label>
                <Input
                  id="newPass"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPass">Konfirmasi Kata Sandi Baru</Label>
                <Input
                  id="confirmPass"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border pt-4">
            <Button type="submit" size="sm" variant="outline">
              Perbarui Kata Sandi
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
