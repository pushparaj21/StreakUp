// store/habitLogStore.ts
import { create } from 'zustand';
import { getHabitLogById } from '../db/queries';

type LogEntry = { date: string; value: number };

type HabitLogState = {
  logs: Record<number, LogEntry[]>; // habit_id -> logs[]
  loadLogs: (habitId: number) => Promise<void>;
  updateLog: (habitId: number, date: string, value: number) => void;
};

export const useHabitLogStore = create<HabitLogState>((set, get) => ({
  logs: {},
  loadLogs: async (habitId: number) => {
    const logList = await getHabitLogById(habitId);
    set(state => ({
      logs: { ...state.logs, [habitId]: logList },
    }));
  },
  updateLog: (habitId, date, value) => {
    set(state => {
      const existing = state.logs[habitId] ?? [];
      const index = existing.findIndex(l => l.date === date);
      if (index !== -1) {
        existing[index].value = value;
      } else {
        existing.push({ date, value });
      }
      return { logs: { ...state.logs, [habitId]: [...existing] } };
    });
  },
}));
