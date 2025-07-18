/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Button,
  Pressable,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import GithubHeatMap, { IconContainer } from './components/GithubHeatMap';
import * as LucideIcons from 'lucide-react-native';
import db, { initTables } from './db/init';
import { getAllHabits, getHabitLogById } from './db/queries';
import { useState, useEffect, useRef } from 'react';

import CreateHabitModal from './components/CreateHabitModal';
import { useHabitStore } from './store/habitStore';
import Calender from './components/Calender';
import { IconEmojiPicker } from './components/IconEmojiPIcker';

import Icon from './components/atom/LucidIcon';

function App() {
  const [habitlog, setHabitlog] = useState<any[]>([]);
  const { fetchHabits, habits } = useHabitStore();

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    initTables();
    fetchHabits();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(0,0,0)' }}>
        <CreateHabitModal isOpen={isModalVisible} toggleOpen={toggleModal} />
        <View style={styles.container}>
          <StatusBar barStyle={true ? 'light-content' : 'dark-content'} />
          <View style={styles.header}>
            <Pressable onPress={toggleModal}>
              <LucideIcons.Settings size={27} color={'rgb(235, 235, 235)'} />
            </Pressable>
            <Pressable onPress={toggleModal}>
              <LucideIcons.CirclePlus size={27} color={'rgb(235, 235, 235)'} />
            </Pressable>
          </View>

          <FlatList
            data={habits}
            renderItem={item => (
              <View style={{ marginBottom: 15 }}>
                <GithubHeatMap
                  title={item?.item.name}
                  description={item?.item?.description}
                  icon={
                    <Icon
                      color="rgb(235, 235, 235)"
                      size={25}
                      name={item?.item?.icon}
                    />
                  }
                  color={item?.item.color}
                  todayDone={true}
                  habit_id={item?.item?.id}
                />
              </View>
            )}
          />
          {/* <IconEmojiPicker onSelectEmoji={() => {}} onSelectIcon={() => {}} /> */}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0,0,0)',
    color: 'white',
    paddingHorizontal: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
});

export default App;
