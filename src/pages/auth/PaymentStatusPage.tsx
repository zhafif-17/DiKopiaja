import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  Printer,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Status simulation: read from query param or default to 'lunas'
  const initialStatus = searchParams.get("status") || "lunas";
  const orderId = searchParams.get("order_id") || "DKP-20250814-0021";
  const [currentStatus, setCurrentStatus] = useState<string>(initialStatus);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-2 border-border shadow-lg text-center">
        <CardHeader className="space-y-3 pb-2">
          {currentStatus === "lunas" && (
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          )}
          {currentStatus === "pending" && (
            <div className="h-16 w-16 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock className="h-10 w-10 animate-pulse" />
            </div>
          )}
          {currentStatus === "gagal" && (
            <div className="h-16 w-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <XCircle className="h-10 w-10" />
            </div>
          )}

          <CardTitle className="text-2xl font-bold font-heading">
            {currentStatus === "lunas" && "Pembayaran Berhasil!"}
            {currentStatus === "pending" && "Menunggu Pembayaran"}
            {currentStatus === "gagal" && "Pembayaran Gagal / Dibatalkan"}
          </CardTitle>
          <CardDescription>
            {currentStatus === "lunas" &&
              "Transaksi telah terverifikasi oleh server Midtrans."}
            {currentStatus === "pending" &&
              "Pelanggan belum menyelesaikan pembayaran di aplikasi atau e-wallet."}
            {currentStatus === "gagal" &&
              "Waktu pembayaran telah habis atau pembayaran dibatalkan oleh pengguna."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border text-left space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Nomor Pesanan:</span>
              <span className="font-mono font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Metode Pembayaran:</span>
              <span className="font-medium">Midtrans Snap (QRIS)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status Server:</span>
              <Badge
                variant={
                  currentStatus === "lunas"
                    ? "success"
                    : currentStatus === "pending"
                      ? "warning"
                      : "destructive"
                }
              >
                {currentStatus === "lunas"
                  ? "Lunas"
                  : currentStatus === "pending"
                    ? "Pending"
                    : "Gagal"}
              </Badge>
            </div>
          </div>

          {/* Simulation Toggle for Tester */}
          <div className="pt-2">
            <span className="text-xs text-muted-foreground font-medium block mb-2">
              Simulasi Status Klien (Untuk Pengujian):
            </span>
            <div className="flex justify-center space-x-2">
              <Button
                variant={currentStatus === "lunas" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStatus("lunas")}
              >
                Lunas
              </Button>
              <Button
                variant={currentStatus === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStatus("pending")}
              >
                Pending
              </Button>
              <Button
                variant={currentStatus === "gagal" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStatus("gagal")}
              >
                Gagal
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2">
          {currentStatus === "lunas" && (
            <Button
              className="w-full gap-2"
              onClick={() => {
                window.print();
              }}
            >
              <Printer className="h-4 w-4" />
              Cetak Struk Transaksi
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => navigate("/kasir")}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Layar Kasir
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
