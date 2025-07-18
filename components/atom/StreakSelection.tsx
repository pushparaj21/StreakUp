import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { streakList } from '../../constant/staticData';
import { Check } from 'lucide-react-native';
import CounterInput from './CounterInput';

interface StreakSelectionProps {
  selected: {
    interval: string;
    value: number;
  };
  setSelected: (value: { interval: string; value: number }) => void;
}

const StreakSelection: React.FC<StreakSelectionProps> = ({
  selected,
  setSelected,
}) => {
  return (
    <View style={styles.continer}>
      <View style={styles.steakSetctioncontainer}>
        <View>
          {streakList.map(item => (
            <TouchableOpacity
              key={item.title}
              style={styles.button}
              onPress={() => {
                setSelected({ interval: item.title, value: item.defaultValue });
              }}
            >
              <Text style={styles.title}>{item.title}</Text>
              {item.title == selected.interval && (
                <Check color={'#fff'} size={15} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {selected.interval == 'weekly' && (
        <CounterInput
          count={selected.value}
          inputSubTitle={selected.interval}
          maxValue={7}
          minValue={1}
          setCount={value => {
            setSelected({ interval: selected.interval, value });
          }}
          title=""
        />
      )}
      {selected.interval == 'monthly' && (
        <CounterInput
          count={selected.value}
          inputSubTitle={selected.interval}
          maxValue={30}
          minValue={1}
          setCount={value => {
            setSelected({ interval: selected.interval, value });
          }}
          title=""
        />
      )}
    </View>
  );
};

export default StreakSelection;
const styles = StyleSheet.create({
  continer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  steakSetctioncontainer: {
    borderWidth: 1,
    borderColor: 'rgb(160, 166, 170)',
    borderRadius: 20,
    paddingVertical: 5,
  },
  title: { fontSize: 16, color: '#fff', fontWeight: '400' },
  button: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});
