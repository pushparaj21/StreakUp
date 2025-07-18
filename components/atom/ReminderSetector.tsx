import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Button,
} from 'react-native';
import React, { useState } from 'react';
import { weekDayList } from '../../constant/staticData';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Reminder {
  days: string[];
  time: string;
}

interface ReminderProps {
  reminder: Reminder;
  setReminder: (reminder: Reminder) => void;
}

const ReminderSetector = ({ reminder, setReminder }: ReminderProps) => {
  // const [reminder, setReminder] = useState({
  //   days: ['sum', 'mon'],
  //   time: '',
  // });

  const onDayClick = (day: string) => {
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

  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedTime?: Date) => {
    setShow(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dayWrapper}>
        {weekDayList.map(day => {
          const isSelected = reminder.days.includes(day);
          return (
            <TouchableOpacity
              style={[styles.day, isSelected && styles.selected]}
              key={day}
              onPress={() => onDayClick(day)}
            >
              <Text style={styles.text}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View>
        <Text
          style={[styles.day, styles.selected]}
          onPress={() => setShow(true)}
        >
          {time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </Text>
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
  },
  text: {
    color: 'rgb(232, 243, 243)',
    fontSize: 14,
  },
  selected: {
    backgroundColor: 'rgb(150, 19, 211)',
  },
  day: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    // borderColor: 'rgb(250, 250, 250)',
    borderWidth: 1,
    borderRadius: 5,
  },
});
