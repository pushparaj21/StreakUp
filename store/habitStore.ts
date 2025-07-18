import { create } from 'zustand';
import { getAllHabits } from '../db/queries';
import { HabitType } from '../types/store';

type HabitStore = {
  habits: HabitType[];
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
