import React, { useState } from "react";
import {
  Printer,
  Bluetooth,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  FileText,
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
import { Label } from "@/components/ui/label";
import {
  ReceiptPreview,
  type ReceiptData,
} from "@/components/receipt/ReceiptPreview";
import { useToast } from "@/components/ui/use-toast";
import { MOCK_SALES } from "@/mocks/sales";

export const PrinterPage: React.FC = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [printMode, setPrintMode] = useState<"bluetooth" | "browser">(
    "bluetooth",
  );
  const [paperWidth, setPaperWidth] = useState<"58" | "80">("58");

  const sampleSale = MOCK_SALES[0];
  const sampleReceiptData: ReceiptData = {
    invoiceNo: sampleSale.invoiceNo,
    cashierName: sampleSale.cashierName,
    createdAt: sampleSale.createdAt,
    items: sampleSale.items.map((it) => ({
      productId: it.productId,
      sku: it.skuSnapshot,
      name: it.productNameSnapshot,
      unitPrice: it.unitPrice,
      costPrice: it.costPriceSnapshot,
      qty: it.qty,
      discountAmount: it.discountAmount,
      subtotal: it.subtotal,
      maxStock: 99,
    })),
    subtotal: sampleSale.subtotal,
    itemDiscountTotal: sampleSale.itemDiscountTotal,
    memberDiscount: sampleSale.memberDiscount,
    voucherDiscount: sampleSale.voucherDiscount,
    pointRedeemValue: sampleSale.pointRedeemValue,
    taxAmount: sampleSale.taxAmount,
    total: sampleSale.total,
    paymentMethod: sampleSale.paymentMethod,
    amountPaid: sampleSale.amountPaid,
    changeAmount: sampleSale.changeAmount,
    pointEarned: sampleSale.pointEarned,
    paperWidth,
  };

  const handleConnectToggle = async () => {
    if (isConnected) {
      setIsConnected(false);
      toast({
        title: "Printer Terputus",
        description: "Koneksi ke printer thermal Bluetooth telah diputuskan.",
        variant: "destructive",
      });
    } else {
      setIsConnecting(true);
      // Simulate Web Bluetooth pairing request
      await new Promise((r) => setTimeout(r, 1200));
      setIsConnecting(false);
      setIsConnected(true);
      toast({
        title: "Printer Berhasil Dihubungkan",
        description: 'Terkoneksi ke printer "RPP02N Thermal POS 58mm".',
        variant: "success",
      });
    }
  };

  const handleTestPrint = () => {
    if (printMode === "browser") {
      window.print();
    } else {
      toast({
        title: "Mengirim Data ESC/POS...",
        description: `Perintah tes cetak berhasil dikirim ke printer thermal (${paperWidth}mm).`,
        variant: "success",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-foreground">
          Pengaturan Printer Bluetooth
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Hubungkan printer thermal kasir via Web Bluetooth atau gunakan cetak
          browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Pengaturan (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status Koneksi Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">
                    Status Perangkat Printer
                  </CardTitle>
                  <CardDescription>
                    Koneksi Web Bluetooth langsung ke printer thermal tanpa
                    driver.
                  </CardDescription>
                </div>
                {isConnected ? (
                  <Badge variant="success" className="gap-1.5 py-1 px-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Terhubung
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1.5 py-1 px-2.5">
                    Terputus
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Printer className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">
                      RPP02N Thermal POS
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isConnected
                        ? "Bluetooth ID: 00:11:22:33:44:55"
                        : "Belum dipasangkan"}
                    </div>
                  </div>
                </div>

                <Button
                  variant={isConnected ? "outline" : "default"}
                  size="sm"
                  onClick={handleConnectToggle}
                  disabled={isConnecting}
                  className="gap-2"
                >
                  {isConnecting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bluetooth className="h-4 w-4" />
                  )}
                  {isConnected ? "Putuskan" : "Hubungkan"}
                </Button>
              </div>

              {/* Mode Cetak */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Mode Cetak:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPrintMode("bluetooth")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      printMode === "bluetooth"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-secondary/40 text-muted-foreground"
                    }`}
                  >
                    <div className="font-bold text-sm text-foreground">
                      Bluetooth ESC/POS
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Cepat, langsung terkirim ke printer kasir
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintMode("browser")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      printMode === "browser"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-secondary/40 text-muted-foreground"
                    }`}
                  >
                    <div className="font-bold text-sm text-foreground">
                      Cetak Browser (Fallback)
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Membuka dialog cetak bawaan browser
                    </div>
                  </button>
                </div>
              </div>

              {/* Lebar Kertas Struk */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">
                  Lebar Kertas Thermal:
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaperWidth("58")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paperWidth === "58"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-secondary/40 text-muted-foreground"
                    }`}
                  >
                    <div className="font-bold text-sm text-foreground">
                      58 mm (Standar)
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Lebar 32 karakter per baris
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaperWidth("80")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paperWidth === "80"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-secondary/40 text-muted-foreground"
                    }`}
                  >
                    <div className="font-bold text-sm text-foreground">
                      80 mm (Lebar)
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Lebar 48 karakter per baris
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t border-border pt-4 flex justify-between">
              <span className="text-xs text-muted-foreground">
                Periksa kertas thermal terpasang dengan benar.
              </span>
              <Button onClick={handleTestPrint} className="gap-2">
                <Printer className="h-4 w-4" />
                Tes Cetak Struk
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Kolom Kanan: Live Preview Struk (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>Pratinjau Hasil Struk ({paperWidth}mm)</span>
          </div>

          <div className="p-4 bg-muted/30 rounded-2xl border border-border flex justify-center">
            <ReceiptPreview data={sampleReceiptData} />
          </div>
        </div>
      </div>
    </div>
  );
};
