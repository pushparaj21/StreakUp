import { open } from 'react-native-nitro-sqlite';

const db = open({ name: 'habitkit.db' });

export const initTables = () => {
  // db.execute(`DROP TABLE IF EXISTS habit_logs;`);
  // db.execute(`DROP TABLE IF EXISTS habits;`);
  // db.delete();
  db.execute(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description Text,
      track_type TEXT NOT NULL,          -- step / custom (from selectedValue)
      per_day INTEGER DEFAULT 1,         -- from parDay
      streak_interval TEXT,              -- selectedStreak.interval
      streak_value INTEGER DEFAULT 0,    -- selectedStreak.value
      reminder_days TEXT,                -- JSON string: '["mon","wed"]'
      reminder_time TEXT,                -- e.g. '09:00 AM'
      icon Text,
      color Text,
      category TEXT,                     -- selectedCategory
      display_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      archived INTEGER DEFAULT 0
    );
  `);

  db.execute(`
  CREATE TABLE IF NOT EXISTS habit_logs (
    id INTEGER PRIMARY KEY NOT NULL,
    habit_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    value REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE (habit_id, date)
  );
`);
};

export default db;
