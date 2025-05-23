import { create } from "zustand";

type BalanceState = {
  balance: string | null;
  setBalance: (balance: string | null) => void;
};

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: null,
  setBalance: (balance) => set({ balance }),
}));
