export type HabitType = {
  id: number;
  icon: string;
  description: string;
  track_type: 'step' | 'custom';
  per_day: number;
  name: string;
  created_at: string;
  updated_at: string;
  streak_interval: string;
  streak_value: number;
  reminder_time: string;
  reminder_days: string;
  color: string;
  category: string;
  display_order: number;
  archived: 0 | 1;
};

export type HabitFormProps = {
  isOpen: boolean;
  toggleOpen: () => void;
  habitToEdit?: HabitType | null; // <-- New optional prop
};
