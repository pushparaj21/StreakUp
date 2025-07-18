import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { icons as LucideIcons } from 'lucide-react-native';

// ✅ Emoji list
const emojiList = [
  '🔥',
  '💪',
  '📖',
  '🧘‍♂️',
  '📝',
  '🌟',
  '🍎',
  '💤',
  '🏃‍♂️',
  '😄',
  '🥇',
  '✅',
  '📅',
  '🎯',
  '💻',
  '📚',
];

// ✅ Cast Lucide icons into usable map
const LucideIconComponents = { ...LucideIcons };

// ✅ Filter valid icon names (functions only)
const lucideIconNames = Object.keys(LucideIconComponents).filter(
  name => typeof LucideIconComponents[name] === 'function',
);

export const IconEmojiPicker = ({
  onSelectEmoji,
  onSelectIcon,
  selectedIconName,
}) => {
  const [activeTab, setActiveTab] = useState('icon');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmojis = useMemo(() => {
    return emojiList.filter(emoji => emoji.includes(searchQuery));
  }, [searchQuery]);

  const filteredIcons = useMemo(() => {
    return lucideIconNames.filter(name =>
      name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const renderEmoji = () => (
    <FlatList
      data={filteredEmojis}
      keyExtractor={item => item}
      numColumns={5}
      contentContainerStyle={styles.grid}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => onSelectEmoji(item)}
        >
          <Text style={styles.emoji}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderIcons = () => {
    const iconEntries = Object.entries(LucideIcons).filter(([name]) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return (
      <ScrollView contentContainerStyle={styles.grid}>
        {iconEntries.slice(0, 100).map(([name, IconComponent]) => (
          <TouchableOpacity
            key={name}
            style={styles.item}
            onPress={() => onSelectIcon(name)}
          >
            <IconComponent
              size={24}
              color={
                name == selectedIconName
                  ? 'rgb(251, 251, 255)'
                  : 'rgb(146, 146, 151)'
              }
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      {/* <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'emoji' && styles.activeTab]}
          onPress={() => setActiveTab('emoji')}
        >
          <Text style={styles.tabText}>Emoji</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'icon' && styles.activeTab]}
          onPress={() => setActiveTab('icon')}
        >
          <Text style={styles.tabText}>Icon</Text>
        </TouchableOpacity>
      </View> */}

      {/* Search bar */}
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search..."
        placeholderTextColor="#aaa"
        style={styles.search}
      />
      {activeTab === 'emoji' && renderEmoji()}
      {activeTab === 'icon' && renderIcons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // maxHeight: '80%',
    backgroundColor: 'rgb(17, 17, 18)',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#eee',
  },
  tabText: {
    fontSize: 16,
  },
  search: {
    margin: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
  },
  grid: {
    // paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  item: {
    width: Dimensions.get('window').width / 5,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 26,
  },
});
