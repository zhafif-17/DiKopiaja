import React from "react";
import { Outlet } from "react-router-dom";
import { Coffee } from "lucide-react";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
            <Coffee className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading text-foreground">
              DiKopiaja
            </h1>
            <p className="text-sm text-muted-foreground">
              Sistem Kasir Kedai Kopi Modern
            </p>
          </div>
        </div>

        <Outlet />

        <div className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} DiKopiaja. Semua hak cipta
          dilindungi.
        </div>
      </div>
    </div>
  );
};
