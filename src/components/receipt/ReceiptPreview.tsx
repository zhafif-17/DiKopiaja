import React from "react";
import { MOCK_STORE } from "@/mocks/session";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import type {
  CartItem,
  SelectedCustomer,
  AppliedVoucher,
} from "@/store/cartStore";

export interface ReceiptData {
  invoiceNo: string;
  cashierName: string;
  createdAt: string | Date;
  items: CartItem[];
  subtotal: number;
  itemDiscountTotal: number;
  memberDiscount: number;
  voucherDiscount: number;
  pointRedeemValue: number;
  taxAmount: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  changeAmount: number;
  pointEarned: number;
  customer?: SelectedCustomer | null;
  voucher?: AppliedVoucher | null;
  paperWidth?: "58" | "80";
  isCopy?: boolean;
}

export const ReceiptPreview: React.FC<{ data: ReceiptData }> = ({ data }) => {
  const is80 = data.paperWidth === "80";

  return (
    <div
      className={`receipt-print bg-white text-black p-4 mx-auto font-mono text-xs leading-relaxed ${
        is80 ? "w-[80mm] max-w-[320px]" : "w-[58mm] max-w-[240px]"
      } border border-dashed border-gray-300 shadow-sm`}
    >
      {/* Header Toko */}
      <div className="text-center pb-2 border-b border-dashed border-black/50 space-y-0.5">
        <div className="font-bold text-sm tracking-wide">{MOCK_STORE.name}</div>
        <div className="text-[10px] text-gray-700">{MOCK_STORE.address}</div>
        <div className="text-[10px] text-gray-700">
          Telp: {MOCK_STORE.phone}
        </div>
        {data.isCopy && (
          <div className="mt-1 font-bold text-[11px] border border-black inline-block px-1">
            *** COPY STRUK ***
          </div>
        )}
      </div>

      {/* Meta Transaksi */}
      <div className="py-2 border-b border-dashed border-black/50 text-[10px] space-y-0.5">
        <div className="flex justify-between">
          <span>No: {data.invoiceNo}</span>
        </div>
        <div className="flex justify-between">
          <span>Waktu:</span>
          <span>{formatDateTime(data.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kasir:</span>
          <span>{data.cashierName}</span>
        </div>
        {data.customer && (
          <div className="flex justify-between font-semibold">
            <span>Pelanggan:</span>
            <span>
              {data.customer.name} ({data.customer.tier.toUpperCase()})
            </span>
          </div>
        )}
      </div>

      {/* Daftar Item */}
      <div className="py-2 border-b border-dashed border-black/50 space-y-1">
        {data.items.map((item, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="font-medium text-[11px] truncate">{item.name}</div>
            <div className="flex justify-between text-[10px]">
              <span>
                {item.qty} x {formatRupiah(item.unitPrice)}
              </span>
              <span>{formatRupiah(item.qty * item.unitPrice)}</span>
            </div>
            {item.discountAmount > 0 && (
              <div className="flex justify-between text-[10px] text-gray-600 pl-2">
                <span>Diskon item:</span>
                <span>-{formatRupiah(item.discountAmount)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rincian Total */}
      <div className="py-2 border-b border-dashed border-black/50 space-y-0.5 text-[10px]">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatRupiah(data.subtotal)}</span>
        </div>

        {data.itemDiscountTotal > 0 && (
          <div className="flex justify-between">
            <span>Diskon Item:</span>
            <span>-{formatRupiah(data.itemDiscountTotal)}</span>
          </div>
        )}

        {data.memberDiscount > 0 && (
          <div className="flex justify-between">
            <span>Diskon Member:</span>
            <span>-{formatRupiah(data.memberDiscount)}</span>
          </div>
        )}

        {data.voucherDiscount > 0 && (
          <div className="flex justify-between">
            <span>Voucher ({data.voucher?.code}):</span>
            <span>-{formatRupiah(data.voucherDiscount)}</span>
          </div>
        )}

        {data.pointRedeemValue > 0 && (
          <div className="flex justify-between">
            <span>Tukar Poin:</span>
            <span>-{formatRupiah(data.pointRedeemValue)}</span>
          </div>
        )}

        {data.taxAmount > 0 && (
          <div className="flex justify-between">
            <span>Pajak:</span>
            <span>{formatRupiah(data.taxAmount)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-xs pt-1 border-t border-black/30">
          <span>TOTAL:</span>
          <span>{formatRupiah(data.total)}</span>
        </div>
      </div>

      {/* Pembayaran */}
      <div className="py-2 border-b border-dashed border-black/50 text-[10px] space-y-0.5">
        <div className="flex justify-between">
          <span>Metode:</span>
          <span className="uppercase font-semibold">{data.paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <span>Bayar:</span>
          <span>{formatRupiah(data.amountPaid)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kembalian:</span>
          <span>{formatRupiah(data.changeAmount)}</span>
        </div>
        {data.pointEarned > 0 && (
          <div className="flex justify-between font-semibold pt-1 text-emerald-800">
            <span>Poin Didapat:</span>
            <span>+{data.pointEarned} Poin</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 text-center text-[10px] text-gray-700 space-y-1">
        <p>{MOCK_STORE.receiptFooter}</p>
        <p className="text-[9px] text-gray-400">DiKopiaja Web System</p>
      </div>
    </div>
  );
};
