import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { KasirLayout } from "@/components/layout/KasirLayout";
import { OwnerLayout } from "@/components/layout/OwnerLayout";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { ShiftGuard } from "@/router/ShiftGuard";

// Auth & Public Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { SetupPage } from "@/pages/auth/SetupPage";
import { PaymentStatusPage } from "@/pages/auth/PaymentStatusPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Kasir Pages
import { KasirPage } from "@/pages/kasir/KasirPage";
import { ShiftPage } from "@/pages/kasir/ShiftPage";
import { RiwayatPage } from "@/pages/kasir/RiwayatPage";

// Owner Pages
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { TransaksiListPage } from "@/pages/transaksi/TransaksiListPage";
import { TransaksiDetailPage } from "@/pages/transaksi/TransaksiDetailPage";
import { ShiftRiwayatPage } from "@/pages/shift/ShiftRiwayatPage";
import { InventarisListPage } from "@/pages/inventaris/InventarisListPage";
import { ProdukFormPage } from "@/pages/inventaris/ProdukFormPage";
import { StokMasukPage } from "@/pages/inventaris/StokMasukPage";
import { KategoriPage } from "@/pages/inventaris/KategoriPage";
import { PelangganListPage } from "@/pages/pelanggan/PelangganListPage";
import { PelangganDetailPage } from "@/pages/pelanggan/PelangganDetailPage";
import { VoucherPage } from "@/pages/voucher/VoucherPage";
import { LabaRugiPage } from "@/pages/laporan/LabaRugiPage";
import { BiayaPage } from "@/pages/laporan/BiayaPage";
import { NotifikasiPage } from "@/pages/notifikasi/NotifikasiPage";
import { TokoPage } from "@/pages/pengaturan/TokoPage";
import { PoinPage } from "@/pages/pengaturan/PoinPage";
import { PenggunaPage } from "@/pages/pengaturan/PenggunaPage";
import { PrinterPage } from "@/pages/pengaturan/PrinterPage";
import { AkunPage } from "@/pages/akun/AkunPage";

export const router = createBrowserRouter([
  // Root Redirect
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // Public & Auth Routes
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/setup", element: <SetupPage /> },
    ],
  },
  {
    path: "/pembayaran/selesai",
    element: <PaymentStatusPage />,
  },

  // Kasir Routes (Kasir & Owner)
  {
    element: (
      <ProtectedRoute allowedRoles={["kasir", "owner"]}>
        <KasirLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/kasir",
        element: (
          <ShiftGuard>
            <KasirPage />
          </ShiftGuard>
        ),
      },
      {
        path: "/kasir/shift",
        element: <ShiftPage />,
      },
      {
        path: "/kasir/riwayat",
        element: <RiwayatPage />,
      },
    ],
  },

  // Owner Dashboard Routes (Owner Only)
  {
    element: (
      <ProtectedRoute allowedRoles={["owner"]}>
        <OwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/transaksi", element: <TransaksiListPage /> },
      { path: "/transaksi/:invoiceNo", element: <TransaksiDetailPage /> },
      { path: "/shift", element: <ShiftRiwayatPage /> },
      { path: "/inventaris", element: <InventarisListPage /> },
      { path: "/inventaris/baru", element: <ProdukFormPage /> },
      { path: "/inventaris/:id", element: <ProdukFormPage /> },
      { path: "/inventaris/stok-masuk", element: <StokMasukPage /> },
      { path: "/inventaris/kategori", element: <KategoriPage /> },
      { path: "/pelanggan", element: <PelangganListPage /> },
      { path: "/pelanggan/:id", element: <PelangganDetailPage /> },
      { path: "/voucher", element: <VoucherPage /> },
      { path: "/laporan/laba-rugi", element: <LabaRugiPage /> },
      { path: "/laporan/biaya", element: <BiayaPage /> },
      { path: "/notifikasi", element: <NotifikasiPage /> },
      { path: "/pengaturan/toko", element: <TokoPage /> },
      { path: "/pengaturan/poin", element: <PoinPage /> },
      { path: "/pengaturan/pengguna", element: <PenggunaPage /> },
      { path: "/pengaturan/printer", element: <PrinterPage /> },
      { path: "/akun", element: <AkunPage /> },
    ],
  },

  // 404 Wildcard
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
