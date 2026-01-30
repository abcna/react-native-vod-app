import { create } from "zustand";

type PlayerState = {
  currentEpisodeId: string | null;
  setEpisode: (id: string) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  currentEpisodeId: null,
  setEpisode: (id) => set({ currentEpisodeId: id }),
}));
