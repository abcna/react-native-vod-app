import { create } from "zustand";

type AuthState = {
  userId: string | null;
  isLoggedIn: boolean;
  login: (userId: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  isLoggedIn: false,
  login: (userId) => set({ userId, isLoggedIn: true }),
  logout: () => set({ userId: null, isLoggedIn: false }),
}));
