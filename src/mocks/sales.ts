export type PaymentMethod =
  | "tunai"
  | "qris"
  | "kartu"
  | "ewallet"
  | "transfer_va";
export type SaleStatus =
  | "pending"
  | "lunas"
  | "gagal"
  | "kedaluwarsa"
  | "dibatalkan"
  | "refund";

export interface SaleItem {
  id: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  qty: number;
  unitPrice: number;
  costPriceSnapshot: number;
  discountAmount: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  shiftId: string;
  cashierId: string;
  cashierName: string;
  customerId?: string;
  customerName?: string;
  voucherId?: string;
  subtotal: number;
  itemDiscountTotal: number;
  memberDiscount: number;
  voucherDiscount: number;
  pointRedeemValue: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  changeAmount: number;
  pointEarned: number;
  status: SaleStatus;
  cancelReason?: string;
  cancelledBy?: string;
  paidAt?: string;
  createdAt: string;
  items: SaleItem[];
}

export const MOCK_SALES: Sale[] = [
  {
    id: "sale-021",
    invoiceNo: "DKP-20250814-0021",
    shiftId: "shift-005",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    customerId: "cust-001",
    customerName: "Sari Wulandari",
    voucherId: "voucher-001",
    subtotal: 60000,
    itemDiscountTotal: 0,
    memberDiscount: 6000,
    voucherDiscount: 6000,
    pointRedeemValue: 0,
    taxAmount: 0,
    total: 48000,
    paymentMethod: "qris",
    amountPaid: 48000,
    changeAmount: 0,
    pointEarned: 4,
    status: "lunas",
    paidAt: new Date(Date.now() - 15 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 16 * 60000).toISOString(),
    items: [
      {
        id: "item-001",
        productId: "prod-001",
        productNameSnapshot: "Kopi Susu Gula Aren",
        skuSnapshot: "KS-001",
        qty: 2,
        unitPrice: 18000,
        costPriceSnapshot: 6500,
        discountAmount: 0,
        subtotal: 36000,
      },
      {
        id: "item-002",
        productId: "prod-014",
        productNameSnapshot: "Croissant Butter",
        skuSnapshot: "KS-014",
        qty: 1,
        unitPrice: 24000,
        costPriceSnapshot: 9000,
        discountAmount: 0,
        subtotal: 24000,
      },
    ],
  },
  {
    id: "sale-020",
    invoiceNo: "DKP-20250814-0020",
    shiftId: "shift-005",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    subtotal: 33000,
    itemDiscountTotal: 0,
    memberDiscount: 0,
    voucherDiscount: 0,
    pointRedeemValue: 0,
    taxAmount: 0,
    total: 33000,
    paymentMethod: "tunai",
    amountPaid: 50000,
    changeAmount: 17000,
    pointEarned: 3,
    status: "lunas",
    paidAt: new Date(Date.now() - 40 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    items: [
      {
        id: "item-003",
        productId: "prod-002",
        productNameSnapshot: "Americano",
        skuSnapshot: "KS-002",
        qty: 1,
        unitPrice: 15000,
        costPriceSnapshot: 4000,
        discountAmount: 0,
        subtotal: 15000,
      },
      {
        id: "item-004",
        productId: "prod-013",
        productNameSnapshot: "Kentang Goreng",
        skuSnapshot: "KS-013",
        qty: 1,
        unitPrice: 18000,
        costPriceSnapshot: 6000,
        discountAmount: 0,
        subtotal: 18000,
      },
    ],
  },
  {
    id: "sale-019",
    invoiceNo: "DKP-20250814-0019",
    shiftId: "shift-005",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    customerId: "cust-002",
    customerName: "Andi Kurniawan",
    subtotal: 44000,
    itemDiscountTotal: 0,
    memberDiscount: 2200,
    voucherDiscount: 0,
    pointRedeemValue: 2000,
    taxAmount: 0,
    total: 39800,
    paymentMethod: "ewallet",
    amountPaid: 39800,
    changeAmount: 0,
    pointEarned: 3,
    status: "lunas",
    paidAt: new Date(Date.now() - 75 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 76 * 60000).toISOString(),
    items: [
      {
        id: "item-005",
        productId: "prod-003",
        productNameSnapshot: "Cappuccino",
        skuSnapshot: "KS-003",
        qty: 2,
        unitPrice: 22000,
        costPriceSnapshot: 5000,
        discountAmount: 0,
        subtotal: 44000,
      },
    ],
  },
  {
    id: "sale-018",
    invoiceNo: "DKP-20250814-0018",
    shiftId: "shift-005",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    subtotal: 25000,
    itemDiscountTotal: 0,
    memberDiscount: 0,
    voucherDiscount: 0,
    pointRedeemValue: 0,
    taxAmount: 0,
    total: 25000,
    paymentMethod: "qris",
    amountPaid: 0,
    changeAmount: 0,
    pointEarned: 0,
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      {
        id: "item-006",
        productId: "prod-004",
        productNameSnapshot: "Latte Art",
        skuSnapshot: "KS-004",
        qty: 1,
        unitPrice: 25000,
        costPriceSnapshot: 7000,
        discountAmount: 0,
        subtotal: 25000,
      },
    ],
  },
  {
    id: "sale-017",
    invoiceNo: "DKP-20250814-0017",
    shiftId: "shift-005",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    subtotal: 36000,
    itemDiscountTotal: 0,
    memberDiscount: 0,
    voucherDiscount: 0,
    pointRedeemValue: 0,
    taxAmount: 0,
    total: 36000,
    paymentMethod: "tunai",
    amountPaid: 40000,
    changeAmount: 4000,
    pointEarned: 3,
    status: "dibatalkan",
    cancelReason: "Pelanggan salah memilih varian dan membatalkan pesanan",
    cancelledBy: "user-002",
    paidAt: new Date(Date.now() - 110 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 115 * 60000).toISOString(),
    items: [
      {
        id: "item-007",
        productId: "prod-001",
        productNameSnapshot: "Kopi Susu Gula Aren",
        skuSnapshot: "KS-001",
        qty: 2,
        unitPrice: 18000,
        costPriceSnapshot: 6500,
        discountAmount: 0,
        subtotal: 36000,
      },
    ],
  },
  {
    id: "sale-016",
    invoiceNo: "DKP-20250814-0016",
    shiftId: "shift-005",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    subtotal: 95000,
    itemDiscountTotal: 0,
    memberDiscount: 0,
    voucherDiscount: 0,
    pointRedeemValue: 0,
    taxAmount: 0,
    total: 95000,
    paymentMethod: "kartu",
    amountPaid: 95000,
    changeAmount: 0,
    pointEarned: 9,
    status: "lunas",
    paidAt: new Date(Date.now() - 130 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 132 * 60000).toISOString(),
    items: [
      {
        id: "item-008",
        productId: "prod-030",
        productNameSnapshot: "Biji Arabika Gayo 200g",
        skuSnapshot: "KS-030",
        qty: 1,
        unitPrice: 95000,
        costPriceSnapshot: 62000,
        discountAmount: 0,
        subtotal: 95000,
      },
    ],
  },
  {
    id: "sale-015",
    invoiceNo: "DKP-20250814-0015",
    shiftId: "shift-005",
    cashierId: "user-002",
    cashierName: "Dewi Lestari",
    customerId: "cust-003",
    customerName: "Maya Anggraini",
    subtotal: 48000,
    itemDiscountTotal: 0,
    memberDiscount: 0,
    voucherDiscount: 0,
    pointRedeemValue: 0,
    taxAmount: 0,
    total: 48000,
    paymentMethod: "qris",
    amountPaid: 48000,
    changeAmount: 0,
    pointEarned: 4,
    status: "lunas",
    paidAt: new Date(Date.now() - 160 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 162 * 60000).toISOString(),
    items: [
      {
        id: "item-009",
        productId: "prod-006",
        productNameSnapshot: "Matcha Latte",
        skuSnapshot: "KS-006",
        qty: 1,
        unitPrice: 28000,
        costPriceSnapshot: 8000,
        discountAmount: 0,
        subtotal: 28000,
      },
      {
        id: "item-010",
        productId: "prod-011",
        productNameSnapshot: "Roti Bakar Srikaya",
        skuSnapshot: "KS-011",
        qty: 1,
        unitPrice: 20000,
        costPriceSnapshot: 7000,
        discountAmount: 0,
        subtotal: 20000,
      },
    ],
  },
  {
    id: "sale-014",
    invoiceNo: "DKP-20250814-0014",
    shiftId: "shift-004",
    cashierId: "user-003",
    cashierName: "Bayu Saputra",
    subtotal: 40000,
    itemDiscountTotal: 0,
    memberDiscount: 0,
    voucherDiscount: 0,
    pointRedeemValue: 0,
    taxAmount: 0,
    total: 40000,
    paymentMethod: "tunai",
    amountPaid: 50000,
    changeAmount: 10000,
    pointEarned: 4,
    status: "lunas",
    paidAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    items: [
      {
        id: "item-011",
        productId: "prod-007",
        productNameSnapshot: "Cokelat Panas",
        skuSnapshot: "KS-007",
        qty: 1,
        unitPrice: 24000,
        costPriceSnapshot: 7000,
        discountAmount: 0,
        subtotal: 24000,
      },
      {
        id: "item-012",
        productId: "prod-008",
        productNameSnapshot: "Teh Susu",
        skuSnapshot: "KS-008",
        qty: 1,
        unitPrice: 16000,
        costPriceSnapshot: 4000,
        discountAmount: 0,
        subtotal: 16000,
      },
    ],
  },
  {
    id: "sale-013",
    invoiceNo: "DKP-20250814-0013",
    shiftId: "shift-004",
    cashierId: "user-003",
    cashierName: "Bayu Saputra",
    subtotal: 24000,
    itemDiscountTotal: 0,
    memberDiscount: 0,
    voucherDiscount: 0,
    pointRedeemValue: 0,
    taxAmount: 0,
    total: 24000,
    paymentMethod: "qris",
    amountPaid: 24000,
    changeAmount: 0,
    pointEarned: 2,
    status: "lunas",
    paidAt: new Date(Date.now() - 22 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 22 * 3600000).toISOString(),
    items: [
      {
        id: "item-013",
        productId: "prod-005",
        productNameSnapshot: "Kopi Tubruk",
        skuSnapshot: "KS-005",
        qty: 2,
        unitPrice: 12000,
        costPriceSnapshot: 3000,
        discountAmount: 0,
        subtotal: 24000,
      },
    ],
  },
  {
    id: "sale-012",
    invoiceNo: "DKP-20250814-0012",
    shiftId: "shift-004",
    cashierId: "user-003",
    cashierName: "Bayu Saputra",
    subtotal: 18000,
    itemDiscountTotal: 0,
    memberDiscount: 0,
    voucherDiscount: 0,
    pointRedeemValue: 0,
    taxAmount: 0,
    total: 18000,
    paymentMethod: "qris",
    amountPaid: 0,
    changeAmount: 0,
    pointEarned: 0,
    status: "gagal",
    createdAt: new Date(Date.now() - 23 * 3600000).toISOString(),
    items: [
      {
        id: "item-014",
        productId: "prod-010",
        productNameSnapshot: "Jus Jeruk Segar",
        skuSnapshot: "KS-010",
        qty: 1,
        unitPrice: 18000,
        costPriceSnapshot: 5000,
        discountAmount: 0,
        subtotal: 18000,
      },
    ],
  },
];
