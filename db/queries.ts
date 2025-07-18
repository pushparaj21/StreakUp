import db from './init';

export const createHabit = (
  name: string,
  description: string,
  trackType: string,
  perDay: number,
  streakInterval: string,
  streakValue: number,
  reminderDays: string[],
  reminderTime: string,
  icon: string,
  color: string,
  category: string,
) => {
  const reminderDaysJson = JSON.stringify(reminderDays);
  // const categoryJson = JSON.stringify(category);
  const now = new Date().toISOString();
  const createdAt = now;
  const updatedAt = now;
  const archived = 0;
  const displayOrder = 0;

  db.execute(
    `INSERT INTO habits (
      name, description, track_type, per_day, streak_interval, streak_value,
      reminder_days, reminder_time, icon, color, category,
      display_order, created_at, updated_at, archived
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      description,
      trackType,
      perDay,
      streakInterval,
      streakValue,
      reminderDaysJson,
      reminderTime,
      icon,
      color,
      category,
      displayOrder,
      createdAt,
      updatedAt,
      archived,
    ],
  );
};

export const getAllHabits = () => {
  const res = db.execute(
    `SELECT * FROM habits WHERE archived = 0 ORDER BY display_order ASC, created_at ASC`,
  );
  return res?.rows?._array ?? [];
};
// export const getAllHabits = async (): Promise<any[]> => {
//   const res = await db.execute(
//     `SELECT * FROM habits WHERE archived = 0 ORDER BY display_order ASC, created_at ASC`,
//   );
//   return res?.rows?._array ?? [];
// };

type HabitLog = {
  date: string; // ISO date string
  value: number; // typically between 0 and 1
};
export const getHabitLogById = (habit_id: number): HabitLog[] => {
  const { rows } = db.execute(
    `SELECT date, value FROM habit_logs WHERE habit_id = ? ORDER BY date ASC`,
    [habit_id],
  );
  return (rows?._array as HabitLog[]) ?? [];
};
