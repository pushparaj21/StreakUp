import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';

import { Activity, X } from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';
import SwipeableModalContainer, { ModalContainer } from './ModalContainer';
import InputText, { InputTextWithLeftArrowModal } from './atom/InputText';
import CustomSegmentedToggle from './atom/CustomSegmentedToggle';
import CounterInput from './atom/CounterInput';
import { colorOptions, categories, streakList } from '../constant/staticData';
import Icon from './atom/LucidIcon';
import StreakSelection from './atom/StreakSelection';
import ReminderSetector from './atom/ReminderSetector';
import { IconEmojiPicker } from './IconEmojiPIcker';
import db from '../db/init';
import { createHabit } from '../db/queries';
import { useHabitStore } from '../store/habitStore';

const { width, height } = Dimensions.get('window');

export default function CreateHabitModal({
  isOpen,
  toggleOpen,
}: {
  isOpen: boolean;
  toggleOpen: () => void;
}) {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('Activity');
  const [description, setDescription] = useState('');
  const [trackedType, setTrackedType] = useState('step');
  const [parDay, setParDay] = useState(1);
  const [selectedStreak, setSelectedStreak] = useState({
    interval: 'none',
    value: 0,
  });
  const [reminder, setReminder] = useState<Reminder>({
    days: [],
    time: '',
  });
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [iconPickerModalOpen, setIconPickerModalOpen] = useState(false);

  const reminderText =
    reminder?.days?.length == 0 ? 'none' : reminder?.days?.join(' , ');

  const onSave = () => {
    createHabit(
      name,
      description,
      trackedType,
      parDay,
      selectedStreak.interval,
      selectedStreak.value,
      reminder.days,
      reminder.time,
      iconName,
      selectedColor,
      selectedCategory ?? '',
    );
    useHabitStore.getState().fetchHabits();
    console.log(
      name,
      description,
      selectedColor,
      parDay,
      selectedCategory,
      selectedStreak,
      reminder,
    );
  };

  return (
    <View>
      <ModalContainer isVisible={isOpen} onClose={toggleOpen}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleOpen}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>New Habbit</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
            paddingHorizontal: 20,
            backgroundColor: 'rgb(17, 17, 18)',
            minHeight: '98%',
          }}
        >
          <View>
            <ImageBackground source={require('./../assets/bg.png')}>
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.47)',

                  zIndex: 10,
                }}
              >
                <Pressable
                  style={styles.iconPicker}
                  onPress={() => setIconPickerModalOpen(true)}
                >
                  <Icon name={iconName} color={'#fff'} size={35} />
                </Pressable>
              </View>
            </ImageBackground>
            {/* jj; */}
            <ModalContainer
              onClose={() => {
                setIconPickerModalOpen(false);
              }}
              isVisible={iconPickerModalOpen}
              zIndex={20}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={() => {
                      setIconPickerModalOpen(false);
                    }}
                  >
                    <X size={24} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.title}>Pick Icon</Text>
                  <View style={{ width: 24 }} />
                </View>
                <IconEmojiPicker
                  onSelectEmoji={() => {}}
                  onSelectIcon={setIconName}
                  selectedIconName={iconName}
                />
              </View>
            </ModalContainer>
            <InputText value={name} onChangeText={setName} label="name" />
            <InputText
              value={description}
              onChangeText={setDescription}
              label="Description"
            />
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowAdvanced(!showAdvanced)}>
              <Text style={styles.advancedToggle}>
                Advanced Options {showAdvanced ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {showAdvanced && (
              <View style={styles.advancedSection}>
                <InputTextWithLeftArrowModal
                  label="Streak Goal"
                  onClick={() => setCategoryModalVisible(true)}
                  value={selectedStreak.interval}
                  modalTitle="Streak Goal"
                >
                  <View>
                    <StreakSelection
                      selected={selectedStreak}
                      setSelected={setSelectedStreak}
                    />
                  </View>
                </InputTextWithLeftArrowModal>
                <InputTextWithLeftArrowModal
                  label="Reminder"
                  onClick={() => setCategoryModalVisible(true)}
                  value={`${reminderText}`}
                  modalTitle="Reminder"
                >
                  <ReminderSetector
                    reminder={reminder}
                    setReminder={setReminder}
                  />
                </InputTextWithLeftArrowModal>

                <Text style={styles.subLabel}>Category</Text>
                <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
                  <Text style={styles.placeholderBox}>
                    {selectedCategory || 'Select Category'}
                  </Text>
                </TouchableOpacity>
                <CustomSegmentedToggle
                  options={[
                    { label: 'Step By Step', value: 'step' },
                    { label: 'Custom Value', value: 'custom' },
                  ]}
                  value={trackedType}
                  onChange={setTrackedType}
                />
                <CounterInput
                  count={parDay}
                  setCount={setParDay}
                  inputSubTitle="day"
                  maxValue={100}
                  minValue={1}
                  title="Completions per day"
                />
              </View>
            )}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text>Save</Text>
          </TouchableOpacity>
        </View>
      </ModalContainer>
      {/* Bottom Sheet for Categories */}
      <SwipeableModalContainer
        isVisible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
      >
        <View style={{ paddingTop: 60, paddingBottom: 100 }}>
          <Text style={styles.titlelight}>Categories</Text>
          <Text style={styles.subTitle}>
            Pick one or multiple categories that your habit fits in{' '}
          </Text>
          <View style={styles.category}>
            {categories.map(cat => {
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setCategoryModalVisible(false);
                  }}
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: 'rgb(88, 88, 89)',
                    backgroundColor: 'rgb(10,10,11)',
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 14 }}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Pressable
            style={{
              backgroundColor: '#9333EA',
              borderRadius: 10,
              position: 'absolute',
              bottom: 20,
              paddingVertical: 8,
              left: 0,
              right: 0,
            }}
          >
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '600',
              }}
            >
              Save
            </Text>
          </Pressable>
        </View>
      </SwipeableModalContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgb(17, 17, 18)',
  },
  footer: {
    position: 'relative',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(17, 17, 18)',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  titlelight: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  label: {
    color: 'rgb(206,206,207)',
    paddingLeft: 10,
    paddingBottom: 8,
    paddingTop: 10,
    fontWeight: 500,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    // margin: 6,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  advancedToggle: {
    color: '#aaa',
    marginTop: 20,
    textAlign: 'center',
  },
  advancedSection: {
    marginTop: 10,
  },
  subLabel: {
    color: '#aaa',
    marginTop: 12,
    marginBottom: 4,
  },
  placeholderBox: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  iconPicker: {
    alignSelf: 'center',
    backgroundColor: '#000',
    borderRadius: 40,
    borderColor: 'rgb(46, 45, 45)',
    borderWidth: 1,
    padding: 20,
    marginVertical: 40,
  },
  category: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 15,
  },
});

interface Reminder {
  days: string[] | [];
  time: string;
}
