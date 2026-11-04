// Mock session untuk Tahap 1 (sebelum backend)
export type UserRole = "owner" | "kasir";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword: boolean;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "user-001",
    name: "Muhammad Zhafif",
    email: "zhafif@kuyngopi.id",
    role: "owner",
    mustChangePassword: false,
  },
  {
    id: "user-002",
    name: "Dewi Lestari",
    email: "dewi@kuyngopi.id",
    role: "kasir",
    mustChangePassword: false,
  },
  {
    id: "user-003",
    name: "Bayu Saputra",
    email: "bayu@kuyngopi.id",
    role: "kasir",
    mustChangePassword: false,
  },
];

export const MOCK_STORE = {
  name: "Dikopi Aja",
  address: "Jl. Nusantara Raya No. 12, Bekasi Timur",
  phone: "021-7185-4402",
  taxPercent: 0,
  receiptFooter: "Terima kasih, sampai jumpa lagi!",
  paperWidth: "58" as "58" | "80",
};
