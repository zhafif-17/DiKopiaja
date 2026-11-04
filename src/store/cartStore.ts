import { create } from 'zustand';

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  unitPrice: number;
  costPrice: number;
  qty: number;
  discountAmount: number;
  subtotal: number;
  maxStock: number;
}

export interface SelectedCustomer {
  id: string;
  name: string;
  phone: string;
  tier: 'reguler' | 'silver' | 'gold';
  points: number;
  memberDiscountPercent: number;
}

export interface AppliedVoucher {
  id: string;
  code: string;
  type: 'persen' | 'nominal';
  value: number;
  maxDiscount?: number;
  discountAmount: number;
}

interface CartState {
  items: CartItem[];
  customer: SelectedCustomer | null;
  voucher: AppliedVoucher | null;
  pointsToRedeem: number;
  taxPercent: number;

  // Computed
  subtotal: number;
  itemDiscountTotal: number;
  memberDiscount: number;
  voucherDiscount: number;
  pointRedeemValue: number;
  taxAmount: number;
  total: number;
  pointsEarnable: number;

  // Actions
  addItem: (item: Omit<CartItem, 'qty' | 'subtotal'>) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  setDiscount: (productId: string, discountAmount: number) => void;
  setCustomer: (customer: SelectedCustomer | null) => void;
  setVoucher: (voucher: AppliedVoucher | null) => void;
  setPointsToRedeem: (points: number) => void;
  clearCart: () => void;
  recalculate: () => void;
}

const POINT_EARN_PER_RUPIAH = 10000; // 1 poin per Rp 10.000

function computeTotals(
  items: CartItem[],
  customer: SelectedCustomer | null,
  voucher: AppliedVoucher | null,
  pointsToRedeem: number,
  taxPercent: number
) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const itemDiscountTotal = items.reduce((sum, i) => sum + i.discountAmount, 0);
  const afterItemDiscount = subtotal - itemDiscountTotal;

  // Member discount
  let memberDiscount = 0;
  if (customer) {
    const pct =
      customer.tier === 'gold' ? 10 : customer.tier === 'silver' ? 5 : 0;
    const override = customer.memberDiscountPercent;
    const effectivePct = Math.max(pct, override);
    memberDiscount = Math.round((effectivePct / 100) * afterItemDiscount);
  }

  const afterMemberDiscount = afterItemDiscount - memberDiscount;

  // Voucher discount
  let voucherDiscount = 0;
  if (voucher) {
    voucherDiscount = voucher.discountAmount;
  }

  const afterVoucher = Math.max(0, afterMemberDiscount - voucherDiscount);

  // Poin tukar
  const pointRedeemValue = Math.min(
    pointsToRedeem * 100, // 1 poin = Rp 100
    Math.round(afterVoucher * 0.5) // maks 50% dari subtotal
  );

  const taxBase = Math.max(0, afterVoucher - pointRedeemValue);
  const taxAmount = Math.round((taxPercent / 100) * taxBase);
  const total = taxBase + taxAmount;

  const pointsEarnable = Math.floor(total / POINT_EARN_PER_RUPIAH);

  return {
    subtotal,
    itemDiscountTotal,
    memberDiscount,
    voucherDiscount,
    pointRedeemValue,
    taxAmount,
    total,
    pointsEarnable,
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customer: null,
  voucher: null,
  pointsToRedeem: 0,
  taxPercent: 0,
  subtotal: 0,
  itemDiscountTotal: 0,
  memberDiscount: 0,
  voucherDiscount: 0,
  pointRedeemValue: 0,
  taxAmount: 0,
  total: 0,
  pointsEarnable: 0,

  addItem: (newItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === newItem.productId);
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.productId === newItem.productId
            ? {
                ...i,
                qty: Math.min(i.qty + 1, i.maxStock),
                subtotal: (i.qty + 1) * i.unitPrice - i.discountAmount,
              }
            : i
        );
      } else {
        const item: CartItem = {
          ...newItem,
          qty: 1,
          subtotal: newItem.unitPrice - newItem.discountAmount,
        };
        items = [...state.items, item];
      }
      const totals = computeTotals(
        items,
        state.customer,
        state.voucher,
        state.pointsToRedeem,
        state.taxPercent
      );
      return { items, ...totals };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const items = state.items.filter((i) => i.productId !== productId);
      const totals = computeTotals(
        items,
        state.customer,
        state.voucher,
        state.pointsToRedeem,
        state.taxPercent
      );
      return { items, ...totals };
    });
  },

  updateQty: (productId, qty) => {
    set((state) => {
      if (qty <= 0) {
        const items = state.items.filter((i) => i.productId !== productId);
        const totals = computeTotals(
          items,
          state.customer,
          state.voucher,
          state.pointsToRedeem,
          state.taxPercent
        );
        return { items, ...totals };
      }
      const items = state.items.map((i) =>
        i.productId === productId
          ? {
              ...i,
              qty: Math.min(qty, i.maxStock),
              subtotal: Math.min(qty, i.maxStock) * i.unitPrice - i.discountAmount,
            }
          : i
      );
      const totals = computeTotals(
        items,
        state.customer,
        state.voucher,
        state.pointsToRedeem,
        state.taxPercent
      );
      return { items, ...totals };
    });
  },

  setDiscount: (productId, discountAmount) => {
    set((state) => {
      const items = state.items.map((i) =>
        i.productId === productId
          ? {
              ...i,
              discountAmount: Math.min(discountAmount, i.unitPrice * i.qty),
              subtotal: i.unitPrice * i.qty - Math.min(discountAmount, i.unitPrice * i.qty),
            }
          : i
      );
      const totals = computeTotals(
        items,
        state.customer,
        state.voucher,
        state.pointsToRedeem,
        state.taxPercent
      );
      return { items, ...totals };
    });
  },

  setCustomer: (customer) => {
    set((state) => {
      const totals = computeTotals(
        state.items,
        customer,
        state.voucher,
        state.pointsToRedeem,
        state.taxPercent
      );
      return { customer, pointsToRedeem: 0, ...totals };
    });
  },

  setVoucher: (voucher) => {
    set((state) => {
      const totals = computeTotals(
        state.items,
        state.customer,
        voucher,
        state.pointsToRedeem,
        state.taxPercent
      );
      return { voucher, ...totals };
    });
  },

  setPointsToRedeem: (points) => {
    set((state) => {
      const totals = computeTotals(
        state.items,
        state.customer,
        state.voucher,
        points,
        state.taxPercent
      );
      return { pointsToRedeem: points, ...totals };
    });
  },

  clearCart: () => {
    set({
      items: [],
      customer: null,
      voucher: null,
      pointsToRedeem: 0,
      subtotal: 0,
      itemDiscountTotal: 0,
      memberDiscount: 0,
      voucherDiscount: 0,
      pointRedeemValue: 0,
      taxAmount: 0,
      total: 0,
      pointsEarnable: 0,
    });
  },

  recalculate: () => {
    set((state) => {
      const totals = computeTotals(
        state.items,
        state.customer,
        state.voucher,
        state.pointsToRedeem,
        state.taxPercent
      );
      return totals;
    });
  },
}));

