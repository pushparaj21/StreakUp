import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ScrollView as ScrollViewType,
} from 'react-native';

const CELL_SIZE = 10;
const CELL_MARGIN = 2;
const WEEKS = 53;
const DAYS = 7;

type HeatMapProps = {
  data: Record<string, number>; // Format: { "2024-07-01": 3, ... }
  color: string;
};

const getPastDates = (): string[] => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - currentDay)); // Move to Saturday of this week

  const days = WEEKS * DAYS;
  const dates: string[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dates.push(dateStr);
  }

  return dates;
};

const PAST_DATES = getPastDates();
const WEEKS_DATA = Array.from({ length: WEEKS }, (_, i) =>
  PAST_DATES.slice(i * DAYS, i * DAYS + DAYS),
);
const getColor = (value: number | undefined): string => {
  switch (value) {
    case 1:
      return 'rgba(217,127,242,1)';
    case 2:
      return 'rgba(217,127,242,0.75)';
    case 3:
      return 'rgba(217,127,242,0.50)';
    case 4:
      return 'rgba(217,127,242,0.35)';
    default:
      return 'rgba(217,127,242,0.20)';
  }
};

export const HeatMap: React.FC<HeatMapProps> = ({ data, color }) => {
  const { r, g, b } = hexToRgb(color);
  const scrollViewRef = useRef<ScrollViewType>(null);

  const weeks: string[][] = WEEKS_DATA;
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [weeks]);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        {/* Weekday Labels (Sticky) */}
        {/* <View style={styles.weekDayLabels}>
          {['', 'mon', '', 'wed', '', 'fri', ''].map((day, index) => (
            <Text key={index} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View> */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
        >
          <View style={styles.grid}>
            {weeks.map((week, i) => (
              <View key={i} style={styles.weekColumn}>
                {week.map((date, j) => {
                  const value = data[date] ?? 0;
                  const alpha = 0.2 + value * 0.8;

                  return (
                    <View
                      key={j}
                      style={[
                        styles.cell,
                        {
                          backgroundColor: `rgba(${r},${g},${b},${alpha})`,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    color: 'rgb(235, 235, 235)',
  },
  grid: {
    flexDirection: 'row',
  },
  weekColumn: {
    flexDirection: 'column',
    marginRight: CELL_MARGIN,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    marginBottom: CELL_MARGIN,
    borderRadius: 3,
  },
  weekDayLabels: {
    marginRight: 4,
    flexDirection: 'column',
  },
  weekDayText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgb(235,235,235)',
    height: CELL_SIZE,
    lineHeight: CELL_SIZE,
    marginBottom: CELL_MARGIN,
    textAlign: 'center',
  },
});
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};
