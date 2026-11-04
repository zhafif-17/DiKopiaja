import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSessionStore } from '@/store/sessionStore';

interface ShiftGuardProps {
  children: React.ReactElement;
}

export const ShiftGuard: React.FC<ShiftGuardProps> = ({ children }) => {
  const { currentUser, activeShiftId } = useSessionStore();
  const location = useLocation();

  // If role is kasir and no active shift, redirect to /kasir/shift
  if (currentUser?.role === 'kasir' && !activeShiftId) {
    return <Navigate to="/kasir/shift" state={{ from: location }} replace />;
  }

  return children;
};

