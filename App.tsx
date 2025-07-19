/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  FlatList,
  Text,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import GithubHeatMap from './components/GithubHeatMap';
import * as LucideIcons from 'lucide-react-native';
import db, { initTables } from './db/init';
import { useState, useEffect, useRef } from 'react';

import CreateHabitModal from './components/CreateHabitModal';
import { useHabitStore } from './store/habitStore';

import Icon from './components/atom/LucidIcon';

function App() {
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#151518' }}>
        <CreateHabitModal isOpen={isModalVisible} toggleOpen={toggleModal} />
        <View style={styles.container}>
          <StatusBar barStyle={true ? 'light-content' : 'dark-content'} />
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={toggleModal}>
                <LucideIcons.Settings size={23} color={'rgb(235, 235, 235)'} />
              </Pressable>
              <Text style={styles.appNameLeft}>
                Streak<Text style={styles.appNameRight}>Up</Text>
              </Text>
            </View>

            <Pressable onPress={toggleModal}>
              <LucideIcons.CirclePlus size={24} color={'rgb(235, 235, 235)'} />
            </Pressable>
          </View>

          <FlatList
            data={habits}
            renderItem={item => (
              <View style={{ marginBottom: 15 }}>
                <GithubHeatMap habit={item.item} />
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appNameLeft: {
    color: '#F1F1F1',
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 600,
  },
  appNameRight: {
    color: '#A855F7',
  },
  container: {
    flex: 1,
    backgroundColor: '#151518',
    color: 'white',
    paddingHorizontal: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
});

export default App;
