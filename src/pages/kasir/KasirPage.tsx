import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  Search,
  Barcode,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  UserPlus,
  UserCheck,
  Ticket,
  Percent,
  CreditCard,
  Banknote,
  QrCode,
  Smartphone,
  Printer,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  X,
  Coffee,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { MOCK_CATEGORIES } from "@/mocks/categories";
import { MOCK_PRODUCTS, type Product } from "@/mocks/products";
import { MOCK_CUSTOMERS, type Customer } from "@/mocks/customers";
import { MOCK_VOUCHERS, type Voucher } from "@/mocks/vouchers";
import { useCartStore } from "@/store/cartStore";
import { useSessionStore } from "@/store/sessionStore";
import { formatRupiah, generateInvoiceNo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import {
  ReceiptPreview,
  type ReceiptData,
} from "@/components/receipt/ReceiptPreview";

export const KasirPage: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useSessionStore();
  const {
    items,
    customer,
    voucher,
    pointsToRedeem,
    subtotal,
    itemDiscountTotal,
    memberDiscount,
    voucherDiscount,
    pointRedeemValue,
    taxAmount,
    total,
    pointsEarnable,
    addItem,
    removeItem,
    updateQty,
    setDiscount,
    setCustomer,
    setVoucher,
    setPointsToRedeem,
    clearCart,
  } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // Modals state
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [discountModalItem, setDiscountModalItem] = useState<{
    productId: string;
    name: string;
    currentDiscount: number;
  } | null>(null);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<
    "tunai" | "qris" | "kartu" | "ewallet"
  >("tunai");
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [isProcessingNonCash, setIsProcessingNonCash] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] =
    useState<ReceiptData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Card payment states
  const [cardFullName, setCardFullName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpMonth, setCardExpMonth] = useState<string>("");
  const [cardExpYear, setCardExpYear] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");

  // E-Wallet payment states
  const [selectedEwallet, setSelectedEwallet] = useState<string>("");
  const [ewalletPhone, setEwalletPhone] = useState<string>("");

  // Voucher input
  const [voucherInputCode, setVoucherInputCode] = useState("");

  // Discount modal input
  const [itemDiscountInput, setItemDiscountInput] = useState<number>(0);

  // Barcode scanner buffer detection
  const barcodeBuffer = useRef<string>("");
  const lastKeyTime = useRef<number>(0);

  // Helper function untuk format card number
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleCardExpMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
      setCardExpMonth(value);
    }
  };

  const handleCardExpYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setCardExpYear(value);
    }
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 5) {
      setCardCvc(value);
    }
  };

  const handleEwalletPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 15) {
      setEwalletPhone(value);
    }
  };

  // Generate QR Code when QRIS payment method is selected
  useEffect(() => {
    if (paymentMethod === "qris" && paymentModalOpen && total > 0) {
      const qrData = JSON.stringify({
        merchant: "DiKopiaja",
        amount: total,
        currency: "IDR",
        invoice: generateInvoiceNo(Math.floor(Math.random() * 10000)),
        timestamp: new Date().toISOString(),
      });
      
      QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
        });
    }
  }, [paymentMethod, paymentModalOpen, total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if active element is an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime.current;

      if (e.key === "Enter") {
        if (barcodeBuffer.current.length >= 4) {
          const code = barcodeBuffer.current;
          barcodeBuffer.current = "";
          const product = MOCK_PRODUCTS.find(
            (p) =>
              p.barcode === code || p.sku.toLowerCase() === code.toLowerCase(),
          );
          if (product) {
            addItem({
              productId: product.id,
              sku: product.sku,
              name: product.name,
              unitPrice: product.sellPrice,
              costPrice: product.costPrice,
              discountAmount: 0,
              maxStock: product.stock,
            });
            toast({
              title: "Produk Dipindai!",
              description: `${product.name} dimasukkan ke keranjang.`,
              variant: "success",
            });
          } else {
            toast({
              title: "Barcode Tidak Dikenal",
              description: `Produk dengan kode "${code}" tidak ditemukan.`,
              variant: "destructive",
            });
          }
        }
        barcodeBuffer.current = "";
      } else if (e.key.length === 1) {
        if (timeDiff > 70) {
          barcodeBuffer.current = "";
        }
        barcodeBuffer.current += e.key;
        lastKeyTime.current = currentTime;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addItem, toast]);

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === null || product.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    if (product.stock <= 0 && !product.allowNegativeStock) {
      toast({
        title: "Stok Habis",
        description: `Stok produk ${product.name} sedang kosong.`,
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      unitPrice: product.sellPrice,
      costPrice: product.costPrice,
      discountAmount: 0,
      maxStock: product.stock,
    });
  };

  const handleApplyVoucher = () => {
    const code = voucherInputCode.trim().toUpperCase();
    const found = MOCK_VOUCHERS.find((v) => v.code === code && v.isActive);

    if (!found) {
      toast({
        title: "Voucher Tidak Valid",
        description: "Kode voucher tidak ditemukan atau sudah tidak aktif.",
        variant: "destructive",
      });
      return;
    }

    if (subtotal < found.minPurchase) {
      toast({
        title: "Syarat Belanja Belum Cukup",
        description: `Minimum belanja untuk voucher ini adalah ${formatRupiah(found.minPurchase)}.`,
        variant: "destructive",
      });
      return;
    }

    let discountAmount = 0;
    if (found.type === "persen") {
      discountAmount = Math.round((found.value / 100) * subtotal);
      if (found.maxDiscount && discountAmount > found.maxDiscount) {
        discountAmount = found.maxDiscount;
      }
    } else {
      discountAmount = found.value;
    }

    setVoucher({
      id: found.id,
      code: found.code,
      type: found.type,
      value: found.value,
      maxDiscount: found.maxDiscount,
      discountAmount,
    });

    toast({
      title: "Voucher Diterapkan",
      description: `Diskon voucher ${formatRupiah(discountAmount)} berhasil dipotong.`,
      variant: "success",
    });
    setVoucherModalOpen(false);
  };

  const handleSelectCustomer = (c: Customer) => {
    const memberDiscountPercent =
      c.tier === "gold" ? 10 : c.tier === "silver" ? 5 : 0;
    setCustomer({
      id: c.id,
      name: c.name,
      phone: c.phone,
      tier: c.tier,
      points: c.points,
      memberDiscountPercent,
    });
    setCustomerModalOpen(false);
    toast({
      title: "Pelanggan Dipilih",
      description: `${c.name} (Member ${c.tier.toUpperCase()}) diterapkan.`,
      variant: "success",
    });
  };

  const handleOpenPayment = () => {
    if (items.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description:
          "Tambahkan minimal satu item untuk melanjutkan pembayaran.",
        variant: "destructive",
      });
      return;
    }
    setPaymentMethod("tunai");
    setCashGiven(total);
    setCardFullName("");
    setCardNumber("");
    setCardExpMonth("");
    setCardExpYear("");
    setCardCvc("");
    setSelectedEwallet("");
    setEwalletPhone("");
    setPaymentModalOpen(true);
  };

  const handleProcessPayment = async () => {
    if (paymentMethod === "tunai" && cashGiven < total) {
      toast({
        title: "Nominal Kurang",
        description: `Uang yang diterima kurang dari total belanja (${formatRupiah(total)}).`,
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod !== "tunai") {
      setIsProcessingNonCash(true);
      // Simulate Midtrans Snap API call & webhook response
      await new Promise((r) => setTimeout(r, 1500));
      setIsProcessingNonCash(false);
    }

    const invoiceNo = generateInvoiceNo(Math.floor(Math.random() * 900) + 100);
    const saleData: ReceiptData = {
      invoiceNo,
      cashierName: currentUser?.name || "Kasir",
      createdAt: new Date(),
      items: [...items],
      subtotal,
      itemDiscountTotal,
      memberDiscount,
      voucherDiscount,
      pointRedeemValue,
      taxAmount,
      total,
      paymentMethod,
      amountPaid: paymentMethod === "tunai" ? cashGiven : total,
      changeAmount:
        paymentMethod === "tunai" ? Math.max(0, cashGiven - total) : 0,
      pointEarned: pointsEarnable,
      customer,
      voucher,
    };

    setLastCompletedSale(saleData);
    setPaymentModalOpen(false);
    setSuccessModalOpen(true);
    setMobileCartOpen(false);
    clearCart();
  };

  const changeAmount = Math.max(0, cashGiven - total);

  // Render cart summary inside right panel or drawer
  const renderCartContent = () => (
    <div className="flex flex-col h-full bg-card">
      {/* Cart Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h2 className="font-heading font-bold text-base text-foreground">
            Keranjang Belanja
          </h2>
          <Badge variant="secondary" className="font-mono">
            {items.reduce((s, i) => s + i.qty, 0)}
          </Badge>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
          >
            Kosongkan
          </Button>
        )}
      </div>

      {/* Customer & Voucher Bar */}
      <div className="p-3 bg-secondary/30 border-b border-border space-y-2">
        {/* Customer Select */}
        <div className="flex items-center justify-between">
          {customer ? (
            <div className="flex items-center space-x-2 truncate">
              <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {customer.name.charAt(0)}
              </div>
              <div className="truncate text-xs">
                <span className="font-semibold text-foreground truncate block">
                  {customer.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Tier {customer.tier.toUpperCase()} • {customer.points} Poin
                </span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              Pelanggan Umum
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCustomerModalOpen(true)}
            className="h-7 text-xs px-2 gap-1"
          >
            {customer ? (
              <>
                <UserCheck className="h-3.5 w-3.5 text-accent" />
                Ganti
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5" />
                Member
              </>
            )}
          </Button>
        </div>

        {/* Loyalty Points Redeem Option */}
        {customer && customer.points >= 10 && (
          <div className="flex items-center justify-between pt-1 border-t border-border/50 text-xs">
            <span className="text-muted-foreground">
              Tukar Poin ({customer.points} tersedia):
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant={pointsToRedeem > 0 ? "default" : "outline"}
                size="sm"
                className="h-6 text-[10px] px-1.5"
                onClick={() =>
                  setPointsToRedeem(
                    pointsToRedeem > 0 ? 0 : Math.min(customer.points, 50),
                  )
                }
              >
                {pointsToRedeem > 0
                  ? `Batal (${pointsToRedeem} Poin)`
                  : "Gunakan Poin"}
              </Button>
            </div>
          </div>
        )}

        {/* Voucher Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          {voucher ? (
            <div className="flex items-center space-x-1.5 text-xs text-primary font-medium">
              <Ticket className="h-3.5 w-3.5" />
              <span>Voucher: {voucher.code}</span>
              <span className="text-muted-foreground">
                (-{formatRupiah(voucher.discountAmount)})
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Gunakan Promo</span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoucherModalOpen(true)}
            className="h-7 text-xs px-2 gap-1"
          >
            <Ticket className="h-3.5 w-3.5" />
            {voucher ? "Ubah" : "Voucher"}
          </Button>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="font-heading font-semibold text-sm text-foreground">
              Keranjang Masih Kosong
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-50">
              Pilih produk di layar atau pindai barcode untuk menambahkan
              pesanan.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="p-3 rounded-xl border border-border bg-secondary/20 flex flex-col space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="pr-2">
                  <div className="font-heading font-semibold text-sm text-foreground line-clamp-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {formatRupiah(item.unitPrice)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                  aria-label={`Hapus ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Discount line if present */}
              {item.discountAmount > 0 && (
                <div className="text-[11px] text-accent flex items-center justify-between">
                  <span>Diskon item:</span>
                  <span>-{formatRupiah(item.discountAmount)}</span>
                </div>
              )}

              {/* Quantity Controls & Subtotal */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setDiscountModalItem({
                      productId: item.productId,
                      name: item.name,
                      currentDiscount: item.discountAmount,
                    })
                  }
                  className="text-[11px] text-muted-foreground hover:text-primary underline flex items-center gap-1"
                >
                  <Percent className="h-3 w-3" />
                  Beri Diskon
                </button>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center border border-border rounded-lg bg-background">
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="h-7 w-7 flex items-center justify-center hover:bg-secondary rounded-l-lg text-foreground"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="h-7 w-7 flex items-center justify-center hover:bg-secondary rounded-r-lg text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="font-semibold text-sm tabular-nums text-foreground min-w-17.5 text-right">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Payment Button */}
      <div className="p-4 border-t border-border bg-card space-y-2">
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal:</span>
            <span className="tabular-nums font-medium text-foreground">
              {formatRupiah(subtotal)}
            </span>
          </div>

          {itemDiscountTotal > 0 && (
            <div className="flex justify-between text-accent">
              <span>Diskon Item:</span>
              <span className="tabular-nums">
                -{formatRupiah(itemDiscountTotal)}
              </span>
            </div>
          )}

          {memberDiscount > 0 && (
            <div className="flex justify-between text-accent">
              <span>Diskon Member ({customer?.tier.toUpperCase()}):</span>
              <span className="tabular-nums">
                -{formatRupiah(memberDiscount)}
              </span>
            </div>
          )}

          {voucherDiscount > 0 && (
            <div className="flex justify-between text-accent">
              <span>Voucher Diskon:</span>
              <span className="tabular-nums">
                -{formatRupiah(voucherDiscount)}
              </span>
            </div>
          )}

          {pointRedeemValue > 0 && (
            <div className="flex justify-between text-accent">
              <span>Tukar Poin ({pointsToRedeem} Poin):</span>
              <span className="tabular-nums">
                -{formatRupiah(pointRedeemValue)}
              </span>
            </div>
          )}

          {taxAmount > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Pajak:</span>
              <span className="tabular-nums">{formatRupiah(taxAmount)}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border flex justify-between items-baseline">
          <span className="font-heading font-bold text-sm text-foreground">
            Total Tagihan:
          </span>
          <span className="font-heading font-extrabold text-xl text-primary tabular-nums">
            {formatRupiah(total)}
          </span>
        </div>

        {customer && pointsEarnable > 0 && (
          <div className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-center font-medium">
            Member akan mendapat +{pointsEarnable} Poin
          </div>
        )}

        <Button
          className="w-full h-12 text-base font-bold shadow-md mt-2 gap-2"
          disabled={items.length === 0}
          onClick={handleOpenPayment}
        >
          <CreditCard className="h-5 w-5" />
          Bayar Sekarang ({formatRupiah(total)})
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-56px)] overflow-hidden">
      {/* Kolom 1 & 2: Produk & Kategori (Kiri/Tengah) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-border bg-background">
        {/* Search Bar & Barcode Scanner Status */}
        <div className="p-4 border-b border-border bg-card flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama produk, SKU, atau scan barcode..."
              className="pl-9 pr-24 h-11 text-base bg-secondary/30"
            />
            {/* Siap Scan Pulse Badge */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-1 rounded-md pointer-events-none select-none">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Siap Scan</span>
            </div>
          </div>

          {/* Mobile Cart Trigger Button */}
          <div className="lg:hidden flex items-center justify-between">
            <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
              <SheetTrigger asChild>
                <Button className="w-full gap-2 h-11">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Lihat Keranjang</span>
                  <Badge variant="secondary" className="ml-auto">
                    {items.reduce((s, i) => s + i.qty, 0)} •{" "}
                    {formatRupiah(total)}
                  </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-full sm:max-w-md">
                {renderCartContent()}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Kategori Horizontal Scroll */}
        <div className="px-4 py-2 border-b border-border bg-card/60 flex items-center space-x-2 overflow-x-auto scrollbar-thin">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full text-xs shrink-0 h-8 transition-colors ${
              selectedCategory === null
                ? "bg-[#84563c] text-white border-[#84563c] hover:bg-[#84563c]/90"
                : "hover:bg-secondary/40"
            }`}
          >
            Semua Menu
          </Button>
          {MOCK_CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full text-xs shrink-0 h-8 transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#84563c] text-white border-[#84563c] hover:bg-[#84563c]/90"
                  : "hover:bg-secondary/40"
              }`}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Grid Produk */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {filteredProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
              <Coffee className="h-12 w-12 text-muted-foreground/30 mb-2" />
              <p className="font-semibold text-sm text-foreground">
                Produk Tidak Ditemukan
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Coba cari dengan kata kunci lain atau pilih kategori yang
                berbeda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => {
                const isLowStock = product.stock <= product.minStock;
                const isOutOfStock = product.stock <= 0;

                return (
                  <Card
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={`cursor-pointer transition-all duration-150 hover:shadow-md hover:border-primary/50 active:scale-[0.98] overflow-hidden flex flex-col justify-between ${
                      isOutOfStock ? "opacity-60 bg-muted/30" : "bg-card"
                    }`}
                  >
                    <div className="p-3.5 space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[10px] font-mono font-medium text-muted-foreground bg-secondary/80 px-1.5 py-0.5 rounded">
                          {product.sku}
                        </span>
                        {isOutOfStock ? (
                          <Badge
                            variant="destructive"
                            className="text-[10px] px-1.5 py-0"
                          >
                            Habis
                          </Badge>
                        ) : isLowStock ? (
                          <Badge
                            variant="warning"
                            className="text-[10px] px-1.5 py-0"
                          >
                            Sisa {product.stock}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            Stok: {product.stock}
                          </span>
                        )}
                      </div>

                      <div className="font-heading font-semibold text-sm text-foreground line-clamp-2 min-h-10p">
                        {product.name}
                      </div>
                    </div>

                    <div className="p-3.5 pt-0 flex justify-between items-center border-t border-border/50 bg-secondary/10 mt-1">
                      <span className="font-heading font-bold text-sm text-primary tabular-nums">
                        {formatRupiah(product.sellPrice)}
                      </span>
                      <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Plus className="h-4 w-4" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Kolom 3: Keranjang Belanja (Desktop Kanan, lebar 380px) */}
      <div className="hidden lg:flex w-96 flex-col h-full border-l border-border bg-card">
        {renderCartContent()}
      </div>

      {/* ================= MODAL PILIH PELANGGAN ================= */}
      <Dialog open={customerModalOpen} onOpenChange={setCustomerModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Member Pelanggan</DialogTitle>
            <DialogDescription>
              Terapkan diskon tier dan poin loyalitas ke transaksi saat ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {MOCK_CUSTOMERS.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectCustomer(c)}
                className="p-3 rounded-xl border border-border hover:bg-secondary/40 cursor-pointer flex justify-between items-center transition-colors"
              >
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    {c.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{c.phone}</div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={c.tier === "gold" ? "warning" : "secondary"}
                    className="capitalize font-semibold text-[10px]"
                  >
                    {c.tier} (
                    {c.tier === "gold"
                      ? "10%"
                      : c.tier === "silver"
                        ? "5%"
                        : "0%"}
                    )
                  </Badge>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {c.points} Poin
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="flex justify-between items-center sm:justify-between">
            {customer && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive text-xs"
                onClick={() => {
                  setCustomer(null);
                  setCustomerModalOpen(false);
                }}
              >
                Hapus Member dari Keranjang
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setCustomerModalOpen(false)}
            >
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL KODE VOUCHER ================= */}
      <Dialog open={voucherModalOpen} onOpenChange={setVoucherModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Masukkan Kode Voucher</DialogTitle>
            <DialogDescription>
              Gunakan kode promo untuk mendapatkan potongan harga.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Input
                placeholder="Contoh: SENJA10"
                value={voucherInputCode}
                onChange={(e) =>
                  setVoucherInputCode(e.target.value.toUpperCase())
                }
                className="uppercase tracking-wider font-mono font-bold text-center text-lg h-12"
              />
            </div>

            <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs space-y-1">
              <span className="font-semibold block text-foreground">
                Voucher Tersedia untuk Uji Coba:
              </span>
              <div className="flex justify-between">
                <span className="font-mono font-bold">SENJA10</span>
                <span>Diskon 10% (Min Rp 50.000)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono font-bold">MERDEKA17</span>
                <span>Potongan Rp 17.000 (Min Rp 85.000)</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex sm:justify-between">
            {voucher && (
              <Button
                variant="ghost"
                className="text-destructive text-xs"
                onClick={() => {
                  setVoucher(null);
                  setVoucherModalOpen(false);
                }}
              >
                Hapus Voucher
              </Button>
            )}
            <Button onClick={handleApplyVoucher}>Terapkan Voucher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL DISKON ITEM ================= */}
      <Dialog
        open={discountModalItem !== null}
        onOpenChange={(open) => !open && setDiscountModalItem(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Diskon Item: {discountModalItem?.name}</DialogTitle>
            <DialogDescription>
              Masukkan nominal rupiah diskon khusus untuk produk ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                Rp
              </span>
              <Input
                type="number"
                className="pl-10 text-base font-semibold tabular-nums"
                placeholder="0"
                value={itemDiscountInput || ""}
                onChange={(e) => setItemDiscountInput(Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDiscountModalItem(null)}
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                if (discountModalItem) {
                  setDiscount(discountModalItem.productId, itemDiscountInput);
                  setDiscountModalItem(null);
                  setItemDiscountInput(0);
                  toast({
                    title: "Diskon Diterapkan",
                    description: `Diskon item sebesar ${formatRupiah(itemDiscountInput)} berhasil disimpan.`,
                    variant: "success",
                  });
                }
              }}
            >
              Simpan Diskon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL PEMBAYARAN ================= */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Penyelesaian Pembayaran</DialogTitle>
            <DialogDescription>
              Total yang harus dibayar:{" "}
              <span className="font-bold text-foreground tabular-nums">
                {formatRupiah(total)}
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* Metode Pembayaran Tabs */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setPaymentMethod("tunai")}
              className={`p-3 rounded-xl border flex flex-col items-center space-y-1 text-center transition-all ${
                paymentMethod === "tunai"
                  ? "border-[#84563c] bg-[#84563c]/10 text-[#84563c] font-bold"
                  : "border-border hover:bg-secondary/40 text-muted-foreground"
              }`}
            >
              <Banknote className="h-5 w-5" />
              <span className="text-xs">Tunai</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("qris")}
              className={`p-3 rounded-xl border flex flex-col items-center space-y-1 text-center transition-all ${
                paymentMethod === "qris"
                  ? "border-[#84563c] bg-[#84563c]/10 text-[#84563c] font-bold"
                  : "border-border hover:bg-secondary/40 text-muted-foreground"
              }`}
            >
              <QrCode className="h-5 w-5" />
              <span className="text-xs">QRIS</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("kartu")}
              className={`p-3 rounded-xl border flex flex-col items-center space-y-1 text-center transition-all ${
                paymentMethod === "kartu"
                  ? "border-[#84563c] bg-[#84563c]/10 text-[#84563c] font-bold"
                  : "border-border hover:bg-secondary/40 text-muted-foreground"
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span className="text-xs">Kartu Debit</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("ewallet")}
              className={`p-3 rounded-xl border flex flex-col items-center space-y-1 text-center transition-all ${
                paymentMethod === "ewallet"
                  ? "border-[#84563c] bg-[#84563c]/10 text-[#84563c] font-bold"
                  : "border-border hover:bg-secondary/40 text-muted-foreground"
              }`}
            >
              <Smartphone className="h-5 w-5" />
              <span className="text-xs">E-Wallet</span>
            </button>
          </div>

          {/* Form sesuai metode */}
          {paymentMethod === "tunai" ? (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Nominal Uang Diterima:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                    Rp
                  </span>
                  <Input
                    type="number"
                    className="pl-10 text-xl font-bold font-mono"
                    value={cashGiven || ""}
                    onChange={(e) => setCashGiven(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setCashGiven(total)}
                >
                  Uang Pas ({formatRupiah(total)})
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setCashGiven(50000)}
                >
                  Rp 50.000
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setCashGiven(100000)}
                >
                  Rp 100.000
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setCashGiven(200000)}
                >
                  Rp 200.000
                </Button>
              </div>

              {/* Kembalian Box */}
              <div className="p-4 rounded-xl bg-secondary/60 border border-border flex justify-between items-center">
                <span className="font-semibold text-sm text-foreground">
                  Kembalian:
                </span>
                <span
                  className={`font-heading font-extrabold text-2xl tabular-nums ${
                    cashGiven < total ? "text-destructive" : "text-accent"
                  }`}
                >
                  {formatRupiah(changeAmount)}
                </span>
              </div>
            </div>
          ) : paymentMethod === "qris" ? (
            <div className="space-y-4 pt-2">
              <div className="p-6 rounded-xl border-2 border-dashed border-primary/30 bg-white flex flex-col items-center justify-center text-center space-y-4">
                {/* QR Code Real */}
                <div className="p-3 bg-white rounded-lg shadow-lg border border-border">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code Payment" 
                      className="w-64 h-64 object-contain"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded">
                      <QrCode className="h-16 w-16 text-gray-400 animate-pulse" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-foreground">
                    Scan QR Code untuk Pembayaran
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Minta pelanggan untuk scan QR code menggunakan aplikasi pembayaran digital. Total:{" "}
                    <strong className="text-foreground">
                      {formatRupiah(total)}
                    </strong>
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Mendukung:</span>
                  <span className="font-semibold text-foreground">GoPay</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">OVO</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">DANA</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">ShopeePay</span>
                </div>
              </div>
            </div>
          ) : paymentMethod === "kartu" ? (
            <div className="space-y-4 pt-2">
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="text-sm"
                    value={cardFullName}
                    onChange={(e) => setCardFullName(e.target.value.toUpperCase())}
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                    <span>Card Number</span>
                    <div className="flex items-center gap-2">
                      <img src="/Logo-Visa.png" alt="Visa" className="h-5 object-contain" />
                      <img src="/Logo-Mastercard.png" alt="Mastercard" className="h-5 object-contain" />
                      <img src="/Logo-JCB.png" alt="JCB" className="h-5 object-contain" />
                    </div>
                  </label>
                  <Input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    className="text-base font-mono tracking-wider"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                  />
                </div>

                {/* Expiration Date & CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Expiration Date
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="MM"
                        className="text-sm text-center"
                        value={cardExpMonth}
                        onChange={handleCardExpMonthChange}
                        maxLength={2}
                      />
                      <span className="text-muted-foreground">/</span>
                      <Input
                        type="text"
                        placeholder="YYYY"
                        className="text-sm text-center"
                        value={cardExpYear}
                        onChange={handleCardExpYearChange}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Security Code (CVC)
                    </label>
                    <Input
                      type="password"
                      placeholder="123"
                      className="text-sm text-center font-mono"
                      value={cardCvc}
                      onChange={handleCardCvcChange}
                      maxLength={5}
                    />
                  </div>
                </div>

                {/* Total Amount Display */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex justify-between items-center">
                  <span className="font-semibold text-sm text-foreground">
                    Total Pembayaran:
                  </span>
                  <span className="font-heading font-extrabold text-xl tabular-nums text-primary">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="space-y-4">
                {/* E-Wallet Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Pilih E-Wallet
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* GoPay */}
                    <button
                      type="button"
                      onClick={() => setSelectedEwallet("gopay")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center space-y-2 transition-all ${
                        selectedEwallet === "gopay"
                          ? "border-[#00AA13] bg-[#00AA13]/10 shadow-md ring-2 ring-[#00AA13]/20"
                          : "border-border hover:border-[#00AA13]/50 hover:bg-secondary/40"
                      }`}
                    >
                      <img 
                        src="/Logo-Gopay.png" 
                        alt="GoPay" 
                        className="h-8 object-contain"
                      />
                      <span className="text-xs font-semibold text-foreground">GoPay</span>
                    </button>

                    {/* DANA */}
                    <button
                      type="button"
                      onClick={() => setSelectedEwallet("dana")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center space-y-2 transition-all ${
                        selectedEwallet === "dana"
                          ? "border-[#118EEA] bg-[#118EEA]/10 shadow-md ring-2 ring-[#118EEA]/20"
                          : "border-border hover:border-[#118EEA]/50 hover:bg-secondary/40"
                      }`}
                    >
                      <img 
                        src="/Logo-Dana.png" 
                        alt="DANA" 
                        className="h-8 object-contain"
                      />
                      <span className="text-xs font-semibold text-foreground">DANA</span>
                    </button>

                    {/* ShopeePay */}
                    <button
                      type="button"
                      onClick={() => setSelectedEwallet("shopeepay")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center space-y-2 transition-all ${
                        selectedEwallet === "shopeepay"
                          ? "border-[#EE4D2D] bg-[#EE4D2D]/10 shadow-md ring-2 ring-[#EE4D2D]/20"
                          : "border-border hover:border-[#EE4D2D]/50 hover:bg-secondary/40"
                      }`}
                    >
                      <img 
                        src="/Logo-Shopeepay.png" 
                        alt="ShopeePay" 
                        className="h-8 object-contain"
                      />
                      <span className="text-xs font-semibold text-foreground">ShopeePay</span>
                    </button>
                  </div>
                </div>

                {/* Phone Number Input */}
                {selectedEwallet && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Nomor Telepon
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                        +62
                      </span>
                      <Input
                        type="tel"
                        placeholder="812 3456 7890"
                        className="pl-12 text-base font-mono"
                        value={ewalletPhone}
                        onChange={handleEwalletPhoneChange}
                        maxLength={15}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Masukkan nomor telepon yang terdaftar di {selectedEwallet === "gopay" ? "GoPay" : selectedEwallet === "dana" ? "DANA" : "ShopeePay"}
                    </p>
                  </div>
                )}

                {/* Total Amount Display */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex justify-between items-center">
                  <span className="font-semibold text-sm text-foreground">
                    Total Pembayaran:
                  </span>
                  <span className="font-heading font-extrabold text-xl tabular-nums text-primary">
                    {formatRupiah(total)}
                  </span>
                </div>

                {/* Info Payment */}
                {selectedEwallet && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                    <p className="font-semibold mb-1">ℹ️ Cara Pembayaran:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px]">
                      <li>Pelanggan akan menerima notifikasi pembayaran di aplikasi</li>
                      <li>Buka aplikasi dan konfirmasi pembayaran</li>
                      <li>Masukkan PIN untuk menyelesaikan transaksi</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setPaymentModalOpen(false)}
              disabled={isProcessingNonCash}
            >
              Batal
            </Button>
            <Button
              className="gap-2 font-bold"
              onClick={handleProcessPayment}
              disabled={
                isProcessingNonCash ||
                (paymentMethod === "tunai" && cashGiven < total) ||
                (paymentMethod === "kartu" && (
                  !cardFullName.trim() ||
                  cardNumber.replace(/\s/g, "").length < 13 ||
                  !cardExpMonth ||
                  !cardExpYear ||
                  cardExpYear.length < 4 ||
                  !cardCvc ||
                  cardCvc.length < 3
                )) ||
                (paymentMethod === "ewallet" && (
                  !selectedEwallet ||
                  !ewalletPhone ||
                  ewalletPhone.length < 9
                ))
              }
            >
              {isProcessingNonCash ? (
                "Memverifikasi..."
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Selesaikan Transaksi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL TRANSAKSI BERHASIL ================= */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="max-w-md text-center">
          <div className="space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <DialogTitle className="text-2xl font-bold font-heading text-foreground">
                Transaksi Berhasil!
              </DialogTitle>
              <DialogDescription className="mt-1">
                Nomor Invoice:{" "}
                <strong className="font-mono text-foreground">
                  {lastCompletedSale?.invoiceNo}
                </strong>
              </DialogDescription>
            </div>

            {/* Struk Mini Preview */}
            <div className="max-h-56 overflow-y-auto border border-border rounded-xl p-2 bg-white text-left scrollbar-thin">
              {lastCompletedSale && <ReceiptPreview data={lastCompletedSale} />}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                className="gap-2 h-11"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="h-4 w-4" />
                Cetak Struk
              </Button>

              <Button
                className="gap-2 h-11"
                onClick={() => {
                  setSuccessModalOpen(false);
                  setLastCompletedSale(null);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Transaksi Baru
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
