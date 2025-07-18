import React, { useState } from 'react';
import { Calendar, LocaleConfig, CalendarList } from 'react-native-calendars';

type CalendarProps = {
  data: Record<string, number>; // Format: { "2024-07-01": 3, ... }
  color: string;
  onDayPress: (date: string) => void;
};

const Calender = ({ data, color, onDayPress }: CalendarProps) => {
  const [selected, setSelected] = useState('');
  const mapedData = mapDatesForCalendar(data, color);
  console.log('u90', mapedData);

  const currentDay = new Date().toISOString().split('T')[0];
  return (
    <Calendar
      onDayPress={day => {
        // setSelected(day.dateString);
        onDayPress(day.dateString);
        console.log(day.dateString);
      }}
      markedDates={mapedData}
      theme={{
        backgroundColor: '#990900',
        calendarBackground: '#0280209',
        textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: '#00adf5',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#00adf5',
        dayTextColor: color,
        textDisabledColor: '#77777a',
      }}
      maxDate={currentDay}
      enableSwipeMonths={true}
      hideExtraDays={true}
      // hideArrows={true}
      // monthFormat={'yyyy MM'}
      // horizontal={true}
      // futureScrollRange={1}
      // pastScrollRange={12}
    />
  );
};

export default Calender;

const mapDatesForCalendar = (data: Record<string, number>, color: string) => {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([_, value]) => value === 1)
      .map(([date]) => [
        date,
        {
          selected: true,
          selectedColor: color,
        },
      ]),
  );
};
