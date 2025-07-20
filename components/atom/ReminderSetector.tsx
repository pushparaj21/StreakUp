import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Button,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { weekDayList } from '../../constant/staticData';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Reminder {
  days: number[];
  time: string;
}

interface ReminderProps {
  reminder: Reminder;
  setReminder: (reminder: Reminder) => void;
}

const ReminderSetector = ({ reminder, setReminder }: ReminderProps) => {
  const [show, setShow] = useState(false);
  const time = parseTimeStringToDate(reminder.time);

  const onDayClick = (day: number) => {
    const exists = reminder?.days?.includes(day);
    let updatedDays;
    if (exists) {
      // Remove day
      updatedDays = reminder.days.filter(d => d !== day);
    } else {
      // Add day
      updatedDays = [...reminder.days, day];
    }
    setReminder({ ...reminder, days: updatedDays });
  };
  const onSelectAllDay = () => {
    setReminder({ ...reminder, days: [0, 1, 2, 3, 4, 5, 6] });
  };
  const onDeselectAllDay = () => {
    setReminder({ ...reminder, days: [] });
  };

  const onChange = (event: any, selectedTime?: Date) => {
    setShow(false);

    if (selectedTime) {
      setReminder({ ...reminder, time: formatTimeToString(selectedTime) });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: '#F1F1F1', marginBottom: 10, fontSize: 12 }}>
        Days
      </Text>
      <View style={styles.dayWrapper}>
        {weekDayList.map((day, index) => {
          const isSelected = reminder.days.includes(index); // index is the number (0–6)

          return (
            <TouchableOpacity
              key={day}
              style={[styles.day, isSelected && styles.selected]}
              onPress={() => onDayClick(index)}
            >
              <Text style={styles.text}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text
        style={{ color: '#C084FC', textAlign: 'right' }}
        onPress={() => {
          if (reminder.days.length == 7) {
            onDeselectAllDay();
          } else {
            onSelectAllDay();
          }
        }}
      >
        {reminder.days.length == 7 ? 'Deselect all' : 'Select all'}
      </Text>
      <View>
        <Text style={{ color: '#F1F1F1', marginBottom: 10, fontSize: 12 }}>
          Time
        </Text>
        <Pressable
          style={[
            styles.day,
            {
              paddingVertical: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
          onPress={() => setShow(true)}
        >
          <Text style={{ fontSize: 14, color: '#F1F1F1' }}>Pick a time</Text>
          <Text style={{ fontSize: 14, color: '#C084FC' }}>
            {time.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </Pressable>
        {show && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
            textColor="#000"
          />
        )}
      </View>
    </View>
  );
};

export default ReminderSetector;
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 10,
    // backgroundColor: 'red',
  },
  dayWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 5,
    marginBottom: 5,
  },
  text: {
    color: 'rgb(232, 243, 243)',
    fontSize: 14,
  },
  selected: {
    backgroundColor: '#9333EA',
  },
  day: {
    borderColor: '#27272A',
    backgroundColor: '#09090B',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    color: '#F1F1F1',
  },
});

const formatTimeToString = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0'); // 00 to 23
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const parseTimeStringToDate = (timeStr: string): Date => {
  const [hourStr, minuteStr] = timeStr.split(':');
  const hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};
