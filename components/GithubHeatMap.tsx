import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Music, Check, Cross, X } from 'lucide-react-native';
import { HeatMap } from './Heatmap';
import { getHabitLogById } from '../db/queries';
import { useHabitLogStore } from '../store/habitLogStore';
import db from '../db/init';
import { ModalContainer } from './ModalContainer';
import Calender from './Calender';

type GithubHeatMapProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  todayDone: boolean;
  habit_id: number;
};

type HabitLog = {
  date: string; // ISO date string
  value: number; // typically between 0 and 1
};
const GithubHeatMap = ({
  title,
  description,
  icon,
  color,
  todayDone,
  habit_id,
}: GithubHeatMapProps) => {
  const { r, g, b } = hexToRgb(color);
  const { logs: allLogs, loadLogs, updateLog } = useHabitLogStore();
  const logs = allLogs[habit_id] ?? [];
  const [modalCalenderOpen, setModalCalenderOpen] = useState(false);

  useEffect(() => {
    if (!allLogs[habit_id]) loadLogs(habit_id);
  }, [habit_id]);
  const habit_log = useMemo(() => convertLogsToMap(logs), [logs]);
  const todayDate = new Date().toISOString().split('T')[0];

  const toggleTodayLog = async () => {
    const today = new Date().toISOString().split('T')[0];
    const current = habit_log[today] ?? 0;
    const newValue = current === 1 ? 0 : 1;

    await db.execute(
      `INSERT OR REPLACE INTO habit_logs
     (habit_id, date, value, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
      [
        habit_id,
        today,
        newValue,
        new Date().toISOString(),
        new Date().toISOString(),
      ],
    );

    updateLog(habit_id, today, newValue); // 🔁 this updates the global state
  };

  const toggleDayLog = async (date: string) => {
    const current = habit_log[date] ?? 0;
    const newValue = current === 1 ? 0 : 1;

    await db.execute(
      `INSERT OR REPLACE INTO habit_logs
     (habit_id, date, value, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
      [
        habit_id,
        date,
        newValue,
        new Date().toISOString(),
        new Date().toISOString(),
      ],
    );

    updateLog(habit_id, date, newValue); // 🔁 this updates the global state
  };

  const GridData = (
    <HeatMap
      // data={{
      //   '2025-07-05': 1,
      //   '2025-07-04': 0.75,
      //   '2025-07-03': 0.5,
      //   '2025-07-02': 0.25,
      //   '2025-07-01': 0,
      //   '2025-06-30': 1,
      //   '2025-06-29': 0.75,
      //   '2025-06-28': 0.5,
      // }}
      data={habit_log}
      color={color}
    />
  );

  return (
    <Pressable
      style={styles.container}
      onPress={() => setModalCalenderOpen(true)}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 15,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconContainer icon={icon} bg={`rgba(${r},${g},${b},0.1)`} />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.textTitle}>{title}</Text>
            <Text style={styles.textDec}>{description}</Text>
          </View>
        </View>
        <Pressable onPress={toggleTodayLog}>
          <IconContainer
            icon={<Check color="rgb(235, 235, 235)" size={25} />}
            bg={
              habit_log[todayDate] == 1
                ? `rgba(${r},${g},${b},1)`
                : `rgba(${r},${g},${b},0.1)`
            }
          />
        </Pressable>
      </View>

      {GridData}
      <ModalContainer
        isVisible={modalCalenderOpen}
        onClose={() => setModalCalenderOpen(false)}
      >
        <View
          style={{
            padding: 10,
            borderWidth: 1,
            margin: 10,
            borderColor: 'rgb(41, 41, 43)',
            backgroundColor: 'rgb(28,28,30)',
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 15,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {icon}
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.textTitle}>{title}</Text>
                <Text style={styles.textDec}>{description}</Text>
              </View>
            </View>
            <Pressable
              style={{
                backgroundColor: 'black',
                padding: 4,
                borderColor: 'rgb(41, 41, 43)',
                borderWidth: 1,
                borderRadius: 5,
              }}
              onPress={() => setModalCalenderOpen(false)}
            >
              <X size={15} color="rgb(235, 235, 235)" strokeWidth={3} />
            </Pressable>
          </View>
          <View>{GridData}</View>

          <Calender data={habit_log} color={color} onDayPress={toggleDayLog} />
        </View>
      </ModalContainer>
    </Pressable>
  );
};

export default GithubHeatMap;
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(28,28,30)',
    padding: 10,
    borderRadius: 15,
  },
  iconContainer: {
    // backgroundColor: 'rgba(217,127,242,0.10)',
    borderRadius: 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    color: 'rgb(235,235,235)',
    fontSize: 18,
    fontWeight: '500',
    textTransform: 'capitalize',
    opacity: 0.9,
    letterSpacing: 1,
  },
  textDec: {
    color: 'rgb(235,235,235)',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
});

export function IconContainer({
  icon,
  bg,
}: {
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <View style={[styles.iconContainer, { backgroundColor: bg }]}>{icon}</View>
  );
}
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const convertLogsToMap = (
  logs: { date: string; value: number }[],
): Record<string, number> => {
  const result: Record<string, number> = {};

  logs.forEach(log => {
    result[log.date] = log.value;
  });

  return result;
};
