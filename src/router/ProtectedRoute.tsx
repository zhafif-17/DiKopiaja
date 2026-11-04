import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import type { UserRole } from "@/mocks/session";

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser, isAuthenticated } = useSessionStore();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If kasir tries to access owner pages, redirect to kasir
    if (currentUser.role === "kasir") {
      return <Navigate to="/kasir" replace />;
    }
    // If owner tries to access unauthorized page
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
