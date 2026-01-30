import { create } from "zustand";

type WalletState = {
  coins: number;
  totalSpent: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  coins: 0,
  totalSpent: 0,
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  spendCoins: (amount) => {
    const state = get();
    if (state.coins >= amount) {
      set((s) => ({
        coins: s.coins - amount,
        totalSpent: s.totalSpent + amount,
      }));
      return true;
    }
    return false;
  },
}));
