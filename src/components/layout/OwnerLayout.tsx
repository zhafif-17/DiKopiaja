import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Coffee,
  LayoutDashboard,
  Receipt,
  Clock,
  Package,
  ArrowDownToLine,
  Tags,
  Users,
  Ticket,
  TrendingUp,
  CreditCard,
  Settings,
  Bell,
  Printer,
  UserCheck,
  Award,
  Store,
  Menu,
  X,
  LogOut,
  ShoppingBag,
  Search,
  ChevronDown,
} from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import { MOCK_STORE } from "@/mocks/session";
import { MOCK_NOTIFICATIONS } from "@/mocks/notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Ringkasan",
    items: [
      { title: "Dasbor Utama", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Penjualan",
    items: [
      { title: "Buka Kasir", path: "/kasir", icon: ShoppingBag },
      { title: "Daftar Transaksi", path: "/transaksi", icon: Receipt },
      { title: "Riwayat Shift", path: "/shift", icon: Clock },
    ],
  },
  {
    group: "Inventaris",
    items: [
      { title: "Daftar Produk", path: "/inventaris", icon: Package },
      {
        title: "Stok Masuk",
        path: "/inventaris/stok-masuk",
        icon: ArrowDownToLine,
      },
      { title: "Kategori", path: "/inventaris/kategori", icon: Tags },
    ],
  },
  {
    group: "Pelanggan & Promo",
    items: [
      { title: "Daftar Pelanggan", path: "/pelanggan", icon: Users },
      { title: "Voucher & Diskon", path: "/voucher", icon: Ticket },
    ],
  },
  {
    group: "Laporan Keuangan",
    items: [
      {
        title: "Laba-Rugi Harian",
        path: "/laporan/laba-rugi",
        icon: TrendingUp,
      },
      { title: "Biaya Operasional", path: "/laporan/biaya", icon: CreditCard },
    ],
  },
  {
    group: "Pengaturan Toko",
    items: [
      { title: "Profil Toko", path: "/pengaturan/toko", icon: Store },
      { title: "Aturan Poin", path: "/pengaturan/poin", icon: Award },
      {
        title: "Manajemen Kasir",
        path: "/pengaturan/pengguna",
        icon: UserCheck,
      },
      {
        title: "Printer Bluetooth",
        path: "/pengaturan/printer",
        icon: Printer,
      },
      { title: "Pusat Notifikasi", path: "/notifikasi", icon: Bell },
    ],
  },
];

export const OwnerLayout: React.FC = () => {
  const { currentUser, logout } = useSessionStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifs] = useState(
    MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length,
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/transaksi/")) return "Detail Transaksi";
    if (path === "/inventaris/baru") return "Tambah Produk Baru";
    if (
      path.startsWith("/inventaris/") &&
      path !== "/inventaris/stok-masuk" &&
      path !== "/inventaris/kategori"
    ) {
      return "Edit Produk";
    }
    if (path.startsWith("/pelanggan/")) return "Profil Pelanggan";

    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        if (item.path === path) return item.title;
      }
    }
    if (path === "/akun") return "Profil Saya";
    return "Dashboard Owner";
  };

  const renderNavList = () => (
    <div className="flex flex-col space-y-6 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.group} className="space-y-1">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
            {group.group}
          </div>
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Fixed Sidebar (Cokelat Espresso Tua #2C2222) */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-sidebar-border z-30" style={{ backgroundColor: '#4B382A', color: '#F5E6D3' }}>
        {/* Sidebar Brand Header */}
        <div className="h-16 px-5 border-b border-sidebar-border flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
            <Coffee className="h-6 w-6" />
          </div>
          <div>
            <div className="font-heading font-bold text-base leading-tight text-sidebar-foreground">
              DiKopiaja
            </div>
            <div className="text-xs text-sidebar-foreground/60 font-medium">
              Owner Panel
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 scrollbar-thin">
          {renderNavList()}
        </div>

        {/* Store badge & User Footer */}
        <div className="p-3 border-t border-sidebar-border bg-sidebar-accent/40">
          <div className="text-xs text-sidebar-foreground/70 mb-2 px-2 flex justify-between items-center">
            <span className="font-medium text-sidebar-foreground truncate max-w-[140px]">
              {MOCK_STORE.name}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] bg-sidebar-accent text-sidebar-foreground border-sidebar-border"
            >
              Owner
            </Badge>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-xs text-rose-300 hover:text-rose-200 hover:bg-sidebar-accent h-8"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Keluar dari Aplikasi
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 border-sidebar-border"
          style={{ backgroundColor: '#4B382A', color: '#F5E6D3' }}
        >
          <SheetHeader className="h-16 px-5 border-b border-sidebar-border flex flex-row items-center space-x-3 text-left">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="font-heading font-bold text-base text-sidebar-foreground">
                DiKopiaja
              </SheetTitle>
              <div className="text-xs text-sidebar-foreground/60">
                Owner Panel
              </div>
            </div>
          </SheetHeader>
          <div className="overflow-y-auto px-4 h-[calc(100vh-80px)] scrollbar-thin pb-10">
            {renderNavList()}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs bg-white">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon-sm"
              className="lg:hidden text-card-foreground border-card-foreground/20 hover:bg-card-foreground/10"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-heading font-bold text-lg sm:text-xl text-card-foreground truncate">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Direct Quick Button to Kasir */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/kasir")}
              className="hidden sm:flex items-center space-x-1.5 h-9 px-3 text-xs font-semibold border-card-foreground/20 hover:border-primary text-card-foreground hover:text-primary hover:bg-card-foreground/10 transition-colors"
            >
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span>Buka Layar Kasir</span>
            </Button>

            {/* Quick search input */}
            <div className="relative hidden md:block w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-card-foreground/60" />
              <Input
                placeholder="Cari transaksi, produk..."
                className="pl-9 h-9 text-xs bg-card-foreground/5 border-card-foreground/20 text-card-foreground placeholder:text-card-foreground/50"
              />
            </div>

            {/* Notification bell */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative text-card-foreground hover:bg-card-foreground/10 hover:text-card-foreground"
              onClick={() => navigate("/notifikasi")}
              aria-label="Pusat Notifikasi"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 h-9 px-2 text-card-foreground hover:bg-card-foreground/10"
                >
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                    {currentUser?.name.charAt(0) || "R"}
                  </div>
                  <span className="text-xs font-semibold hidden sm:inline max-w-[120px] truncate">
                    {currentUser?.name || "Owner"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-card-foreground/70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold text-foreground">
                    {currentUser?.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-normal">
                    {currentUser?.email}
                  </div>
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    Owner
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/kasir")}
                  className="cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4 mr-2 text-primary" />
                  Buka Layar Kasir
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/akun")}
                  className="cursor-pointer"
                >
                  Profil Saya
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/pengaturan/toko")}
                  className="cursor-pointer"
                >
                  Pengaturan Toko
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive font-medium cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
