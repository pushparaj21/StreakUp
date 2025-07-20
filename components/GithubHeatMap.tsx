import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Music, Check, Cross, X, Edit } from 'lucide-react-native';
import { HeatMap } from './Heatmap';
import { getHabitLogById } from '../db/queries';
import { useHabitLogStore } from '../store/habitLogStore';
import db from '../db/init';
import { ModalContainer } from './ModalContainer';
import Calender from './Calender';
import { HabitType } from '../types/store';
import Icon from './atom/LucidIcon';
import CreateHabitModal from './CreateHabitModal';

type GithubHeatMapProps = {
  habit: HabitType;
};

const GithubHeatMap = ({ habit }: GithubHeatMapProps) => {
  const { color, description, icon, id: habit_id, name } = habit;
  const { r, g, b } = hexToRgb(color);
  const { logs: allLogs, loadLogs, updateLog } = useHabitLogStore();
  const logs = allLogs[habit_id] ?? [];
  const [modalCalenderOpen, setModalCalenderOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

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
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <IconContainer
            icon={<Icon name={icon} color="rgb(235, 235, 235)" size={25} />}
            bg={`rgba(${r},${g},${b},0.1)`}
          />
          <View style={{ marginLeft: 15, flex: 1, marginRight: 15 }}>
            <Text style={styles.textTitle}>{name}</Text>
            <Text style={styles.textDec} numberOfLines={1} ellipsizeMode="tail">
              {description}
            </Text>
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
              // flex: 1,
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
            >
              {<Icon name={icon} color="rgb(235, 235, 235)" size={25} />}
              <View style={{ marginHorizontal: 15, flex: 1 }}>
                <Text style={styles.textTitle}>{name}</Text>
                <Text
                  style={styles.textDec}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {description}
                </Text>
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
          <View style={styles.state}>
            <Pressable
              onPress={() => setModalEditOpen(true)}
              style={styles.editButton}
            >
              <Edit size={15} color="rgb(235, 235, 235)" strokeWidth={2} />
            </Pressable>
          </View>

          <View style={styles.devider}></View>
          <CreateHabitModal
            isOpen={modalEditOpen}
            toggleOpen={() => setModalEditOpen(false)}
            habitToEdit={habit}
          />

          <Calender data={habit_log} color={color} onDayPress={toggleDayLog} />
        </View>
      </ModalContainer>
    </Pressable>
  );
};

export default GithubHeatMap;
const styles = StyleSheet.create({
  devider: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#27272A',
    marginVertical: 20,
  },
  container: {
    // backgroundColor: 'rgb(28,28,30)',
    backgroundColor: '#09090B',
    borderColor: '#27272A',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  iconContainer: {
    borderRadius: 10,
    borderColor: '#27272A',
    borderWidth: 1,
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
  editButton: {
    backgroundColor: 'black',
    padding: 4,
    borderColor: 'rgb(41, 41, 43)',
    borderWidth: 1,
    borderRadius: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  state: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
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
