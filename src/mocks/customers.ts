export type MemberTier = "reguler" | "silver" | "gold";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: MemberTier;
  points: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: string;
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-001",
    name: "Sari Wulandari",
    phone: "081234567890",
    email: "sari@kuyngopi.id",
    tier: "gold",
    points: 245,
    totalSpent: 6750000,
    isActive: true,
    createdAt: "2024-03-15T08:00:00+07:00",
  },
  {
    id: "cust-002",
    name: "Adit Kurniawan",
    phone: "085711223344",
    email: "adit@kuyngopi.id",
    tier: "silver",
    points: 88,
    totalSpent: 1850000,
    isActive: true,
    createdAt: "2024-06-10T10:30:00+07:00",
  },
  {
    id: "cust-003",
    name: "Maya Anggraini",
    phone: "081399001212",
    email: "maya@kuyngopi.id",
    tier: "reguler",
    points: 12,
    totalSpent: 185000,
    isActive: true,
    createdAt: "2024-10-01T14:00:00+07:00",
  },
  {
    id: "cust-004",
    name: "Budi Santoso",
    phone: "081298765432",
    email: "budi@kuyngopi.id",
    tier: "silver",
    points: 55,
    totalSpent: 1250000,
    isActive: true,
    createdAt: "2024-07-20T09:00:00+07:00",
  },
  {
    id: "cust-005",
    name: "Rina Kusuma",
    phone: "082134567890",
    email: "rina@kuyngopi.id",
    tier: "reguler",
    points: 30,
    totalSpent: 450000,
    isActive: true,
    createdAt: "2024-09-05T11:00:00+07:00",
  },
];
