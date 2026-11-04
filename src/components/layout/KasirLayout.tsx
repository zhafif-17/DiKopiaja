import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Coffee,
  Printer,
  Wifi,
  Bell,
  User,
  LogOut,
  Clock,
  ShoppingBag,
  History,
  LayoutDashboard,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import { MOCK_STORE } from "@/mocks/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_NOTIFICATIONS } from "@/mocks/notifications";

export const KasirLayout: React.FC = () => {
  const { currentUser, logout, activeShiftId } = useSessionStore();
  const navigate = useNavigate();
  const [unreadNotifs] = useState(
    MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length,
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBrandClick = () => {
    if (currentUser?.role === "owner") {
      navigate("/dashboard");
    } else {
      navigate("/kasir");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Kasir Slim Header */}
      <header className="h-14 border-b border-border px-3 sm:px-4 flex items-center justify-between sticky top-0 z-40 select-none shadow-xs bg-white">
        {/* Brand & Store Name + Back to Dashboard Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Logo (clickable to Dashboard if owner) */}
          <div
            onClick={handleBrandClick}
            className="flex items-center space-x-2.5 cursor-pointer group"
            title={
              currentUser?.role === "owner"
                ? "Klik untuk ke Dashboard Owner"
                : "DiKopiaja"
            }
          >
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <div className="font-heading font-bold text-sm leading-tight text-foreground flex items-center gap-1.5">
                <span>DiKopiaja</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Shift & Device Status Badges */}
        <div className="hidden lg:flex items-center space-x-2">
          {currentUser?.role === "owner" && (
            <Badge
              variant="secondary"
              className="text-[10px] py-1 px-2 font-bold"
            >
              Owner
            </Badge>
          )}

          {activeShiftId ? (
            <Badge variant="success" className="gap-1.5 py-1 px-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Shift Aktif
            </Badge>
          ) : (
            <Badge variant="warning" className="gap-1.5 py-1 px-2.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Shift Belum Buka
            </Badge>
          )}

          <div className="flex items-center space-x-1.5 text-xs text-muted-foreground bg-secondary/80 px-2 py-1 rounded-md">
            <Printer className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-foreground">58mm Bluetooth</span>
          </div>

          <div className="flex items-center space-x-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-medium">
            <Wifi className="h-3.5 w-3.5" />
            <span>Online</span>
          </div>
        </div>

        {/* Navigation Tabs for Cashier */}
        <nav className="flex items-center space-x-1">
          {currentUser?.role === "owner" && (
            <NavLink
              to="/dashboard"
              className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-card-foreground hover:bg-card-foreground/10 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Dasbor</span>
            </NavLink>
          )}

          <NavLink
            to="/kasir"
            end
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md font-semibold"
                  : "text-card-foreground hover:bg-card-foreground/10"
              }`
            }
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Kasir</span>
          </NavLink>

          <NavLink
            to="/kasir/shift"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md font-semibold"
                  : "text-card-foreground hover:bg-card-foreground/10"
              }`
            }
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Shift</span>
          </NavLink>

          <NavLink
            to="/kasir/riwayat"
            className={({ isActive }) =>
              `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md font-semibold"
                  : "text-card-foreground hover:bg-card-foreground/10"
              }`
            }
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Riwayat</span>
          </NavLink>
        </nav>

        {/* Right side: Notifications & User profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative"
            onClick={() => navigate("/notifikasi")}
            aria-label="Pusat Notifikasi"
          >
            <Bell className="h-4 w-4 text-foreground" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 h-9 px-2"
              >
                <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-sm border border-primary/40">
                  {currentUser?.name.charAt(0) || "K"}
                </div>
                <span className="text-xs font-semibold hidden md:inline-block max-w-[120px] truncate text-foreground">
                  {currentUser?.name || "Kasir"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
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
                <Badge
                  variant="outline"
                  className="mt-1 text-[10px] capitalize font-medium"
                >
                  {currentUser?.role}
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {currentUser?.role === "owner" && (
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                  className="font-semibold text-primary focus:text-primary cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2 text-primary" />
                  Kembali ke Dashboard
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => navigate("/pengaturan/printer")}
                className="cursor-pointer"
              >
                <Printer className="h-4 w-4 mr-2 text-muted-foreground" />
                Pengaturan Printer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/akun")}
                className="cursor-pointer"
              >
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                Profil Saya
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

      {/* Main Outlet */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
