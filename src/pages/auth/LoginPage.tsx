import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Mail, AlertCircle, ArrowRight, Check } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import { MOCK_USERS } from "@/mocks/session";
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

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useSessionStore();
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    const success = await login(data.email, data.password);
    setIsLoading(false);

    if (success) {
      toast({
        title: "Berhasil Masuk",
        description: "Selamat datang kembali di DiKopiaja.",
        variant: "success",
      });

      const user = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase(),
      );

      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === "owner") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/kasir", { replace: true });
      }
    } else {
      setErrorMessage("Email atau password salah. Silakan coba lagi.");
    }
  };

  const handleQuickFill = (email: string) => {
    setValue("email", email);
    setValue("password", "password123");
    setErrorMessage(null);
  };

  return (
    <Card className="w-full shadow-md border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Masuk ke Akun</CardTitle>
        <CardDescription>
          Masukkan kredensial akun kasir atau pemilik toko Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nama@kuyngopi.id"
                className="pl-9"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
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
            {isLoading ? "Memproses..." : "Masuk Sekarang"}
          </Button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Akun Demo Cepat (Klik untuk mengisi):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("zhafif@kuyngopi.id")}
              className="text-left p-2 rounded-lg border border-border bg-secondary/40 hover:bg-secondary transition-colors text-xs"
            >
              <div className="font-semibold text-foreground">
                Muhammad Zhafif
              </div>
              <div className="text-[11px] text-muted-foreground">
                Owner Toko
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("dewi@kuyngopi.id")}
              className="text-left p-2 rounded-lg border border-border bg-secondary/40 hover:bg-secondary transition-colors text-xs"
            >
              <div className="font-semibold text-foreground">Dewi Lestari</div>
              <div className="text-[11px] text-muted-foreground">
                Kasir Shift
              </div>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            *Password : <span className="font-mono font-semibold text-foreground">password123</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border pt-4 text-xs text-muted-foreground">
        <span>Belum mengatur toko pertama kali? </span>
        <button
          type="button"
          onClick={() => navigate("/setup")}
          className="ml-1 text-primary hover:underline font-medium"
        >
          Setup Toko Baru
        </button>
      </CardFooter>
    </Card>
  );
};
