import { create } from 'zustand';
import { getAllHabits } from '../db/queries';

type HabitStore = {
  habits: any[];
  fetchHabits: () => Promise<void>;
  refresh: () => void;
};

export const useHabitStore = create<HabitStore>(set => ({
  habits: [],
  fetchHabits: async () => {
    const data = (await getAllHabits()) as any[];
    set({ habits: data });
  },
  refresh: () => useHabitStore.getState().fetchHabits(),
}));
