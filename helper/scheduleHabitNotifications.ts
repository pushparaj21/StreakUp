import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
} from '@notifee/react-native';

type Habit = {
  name: string;
  reminderDays: number[]; // [1, 3, 5]
  reminderTime: string; // '08:30' (24-hour format)
};

export async function scheduleHabitNotifications(habit: Habit) {
  const notificationIds: string[] = [];

  if (habit.reminderDays.length == 0) {
    return notificationIds;
  }
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  const now = new Date();
  const [hour, minute] = habit.reminderTime.split(':').map(Number);

  for (const day of habit.reminderDays) {
    const date = new Date(now);
    const daysUntil = (7 + day - now.getDay()) % 7;
    date.setDate(now.getDate() + daysUntil);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);

    if (date <= now) {
      date.setDate(date.getDate() + 7);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.WEEKLY,
    };

    const notificationId = await notifee.createTriggerNotification(
      {
        title: habit.name,
        body: `Time to track: ${habit.name}`,
        android: { channelId },
      },
      trigger,
    );

    notificationIds.push(notificationId);
  }

  return notificationIds; // Save to habit DB
}

export async function cancelHabitNotifications(notificationIds: string[]) {
  for (const id of notificationIds) {
    await notifee.cancelNotification(id);
  }
}
