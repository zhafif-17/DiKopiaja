// Utility functions for DiKopiaja

/**
 * Format angka menjadi format Rupiah Indonesia
 * Contoh: 25000 → "Rp 25.000"
 */
export function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

/**
 * Format tanggal dan waktu dengan zona waktu Asia/Jakarta
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format durasi dari menit ke jam & menit
 */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} menit`;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} menit`;
}

/**
 * Hitung durasi antara dua tanggal dalam menit
 */
export function diffMinutes(start: Date | string, end: Date | string): number {
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  return Math.floor((e.getTime() - s.getTime()) / 60000);
}

/**
 * Gabungkan class names (utility dari shadcn)
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate nomor invoice format DKP-YYYYMMDD-NNNN
 */
export function generateInvoiceNo(seq: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const n = String(seq).padStart(4, "0");
  return `DKP-${y}${m}${d}-${n}`;
}

/**
 * Truncate teks dengan ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Konversi persentase ke nominal
 */
export function percentToAmount(
  percent: number,
  subtotal: number,
  maxDiscount?: number
): number {
  const amount = Math.round((percent / 100) * subtotal);
  if (maxDiscount !== undefined) return Math.min(amount, maxDiscount);
  return amount;
}

/**
 * Badge variant sesuai status transaksi
 */
export type SaleStatus =
  | "pending"
  | "lunas"
  | "gagal"
  | "kedaluwarsa"
  | "dibatalkan"
  | "refund";

export function getSaleStatusLabel(status: SaleStatus): string {
  const map: Record<SaleStatus, string> = {
    lunas: "Lunas",
    pending: "Menunggu Bayar",
    gagal: "Gagal",
    kedaluwarsa: "Kedaluwarsa",
    dibatalkan: "Dibatalkan",
    refund: "Refund",
  };
  return map[status] ?? status;
}

export function getSaleStatusVariant(
  status: SaleStatus
): "default" | "success" | "warning" | "destructive" | "secondary" {
  const map: Record<
    SaleStatus,
    "default" | "success" | "warning" | "destructive" | "secondary"
  > = {
    lunas: "success",
    pending: "warning",
    gagal: "destructive",
    kedaluwarsa: "destructive",
    dibatalkan: "secondary",
    refund: "secondary",
  };
  return map[status] ?? "default";
}

export type MemberTier = "reguler" | "silver" | "gold";

export function getTierLabel(tier: MemberTier): string {
  const map: Record<MemberTier, string> = {
    reguler: "Reguler",
    silver: "Silver",
    gold: "Gold",
  };
  return map[tier];
}

export function getTierColor(tier: MemberTier): string {
  const map: Record<MemberTier, string> = {
    reguler: "bg-muted text-muted-foreground",
    silver: "bg-slate-100 text-slate-600",
    gold: "bg-yellow-50 text-yellow-700",
  };
  return map[tier];
}

