import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Store, User, Mail, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSessionStore } from "@/store/sessionStore";

const setupSchema = z.object({
  storeName: z.string().min(3, "Nama toko minimal 3 karakter"),
  ownerName: z.string().min(3, "Nama pemilik minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type SetupFormValues = z.infer<typeof setupSchema>;

export const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
  });

  const onSubmit = async (data: SetupFormValues) => {
    setIsLoading(true);
    // Simulate setup
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);

    toast({
      title: "Toko Berhasil Diatur!",
      description: `Selamat datang di DiKopiaja untuk toko ${data.storeName}.`,
      variant: "success",
    });

    // Auto login
    await login(data.email, data.password);
    navigate("/dashboard", { replace: true });
  };

  return (
    <Card className="w-full shadow-md border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Pengaturan Awal Toko</CardTitle>
        <CardDescription>
          Buat profil toko dan akun Pemilik (Owner) pertama Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="storeName">Nama Kedai Kopi / Toko</Label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="storeName"
                placeholder="Contoh: Kopi Senja Kemang"
                className="pl-9"
                {...register("storeName")}
              />
            </div>
            {errors.storeName && (
              <p className="text-xs text-destructive">
                {errors.storeName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ownerName">Nama Lengkap Pemilik</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="ownerName"
                placeholder="Nama Anda"
                className="pl-9"
                {...register("ownerName")}
              />
            </div>
            {errors.ownerName && (
              <p className="text-xs text-destructive">
                {errors.ownerName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Login Owner</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="owner@kuyngopi.id"
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password (minimal 8 karakter)</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Menyimpan Toko..." : "Selesaikan Pengaturan"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-primary hover:underline font-medium"
        >
          Kembali ke Halaman Masuk
        </button>
      </CardFooter>
    </Card>
  );
};
