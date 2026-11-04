import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MockUser } from '@/mocks/session';
import { MOCK_USERS } from '@/mocks/session';

interface SessionState {
  currentUser: MockUser | null;
  activeShiftId: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setActiveShift: (shiftId: string | null) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      currentUser: null,
      activeShiftId: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        // Mock login: cari user berdasarkan email
        await new Promise((r) => setTimeout(r, 600)); // simulate latency
        const user = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          // Set mock shift aktif untuk kasir
          if (user.role === 'kasir') {
            set({ activeShiftId: 'shift-005' });
          }
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, activeShiftId: null });
      },

      setActiveShift: (shiftId) => {
        set({ activeShiftId: shiftId });
      },
    }),
    {
      name: 'dikopiaja-session',
    }
  )
);

