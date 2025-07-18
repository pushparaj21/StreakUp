import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Minus, Plus } from 'lucide-react-native';

const CounterInput = ({
  count,
  setCount,
  minValue,
  maxValue = 100,
  inputSubTitle,
  title,
}: {
  count: number;
  setCount: (value: number) => void;
  minValue: number;
  maxValue: number;
  inputSubTitle: string;
  title: string;
}) => {
  const onIncrement = () => {
    if (count < maxValue) {
      setCount(count + 1);
    }
  };
  const onDecrement = () => {
    if (count > minValue) {
      setCount(count - 1);
    }
  };
  return (
    <>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.wrapper}>
        <Text style={styles.input}>
          {count}/{inputSubTitle}
        </Text>
        <View style={{ flexDirection: 'row', columnGap: 5 }}>
          <Pressable
            style={[styles.buttonLeft, styles.counterButton]}
            onPress={onDecrement}
          >
            <Minus
              size={10}
              color={
                count > minValue
                  ? 'rgb(254, 254, 254)'
                  : 'rgba(254, 254, 254, 0.33)'
              }
              strokeWidth={6}
            />
          </Pressable>
          <Pressable
            style={[styles.buttonRight, styles.counterButton]}
            onPress={onIncrement}
          >
            <Plus
              size={10}
              color={
                count < maxValue
                  ? 'rgb(254, 254, 254)'
                  : 'rgba(254, 254, 254, 0.33)'
              }
              strokeWidth={6}
            />
          </Pressable>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    columnGap: 10,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    borderColor: 'rgb(25,25,26)',
    backgroundColor: 'rgb(10,10,11)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  counterButton: {
    borderColor: 'rgb(25,25,26)',
    backgroundColor: 'rgb(10,10,11)',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderWidth: 1,
    justifyContent: 'center',
    color: 'white',
  },
  buttonLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  buttonRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default CounterInput;
