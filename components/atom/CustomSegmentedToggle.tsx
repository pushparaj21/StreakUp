import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  LayoutChangeEvent,
} from 'react-native';

type Option = {
  label: string;
  value: string;
};

interface Props {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
}

const CustomSegmentedToggle: React.FC<Props> = ({
  options,
  value,
  onChange,
}) => {
  const animation = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  const selectedIndex = options.findIndex(opt => opt.value === value);

  useEffect(() => {
    if (selectedIndex >= 0) {
      Animated.timing(animation, {
        toValue: selectedIndex,
        duration: 250,
        useNativeDriver: false,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  }, [selectedIndex]);

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const segmentWidth = containerWidth / options.length;

  const translateX = animation.interpolate({
    inputRange: options.map((_, i) => i),
    outputRange: options.map((_, i) => i * segmentWidth),
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>How should completions be tracked?</Text>

      <View style={styles.container} onLayout={handleLayout}>
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.slider,
              {
                width: segmentWidth,
                transform: [{ translateX }],
              },
            ]}
          />
        )}

        {options.map((option, index) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                value === option.value && styles.selectedText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // padding: 16,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#111',
    borderRadius: 10,
    zIndex: 0,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    zIndex: 1,
  },
  optionText: {
    color: '#aaa',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CustomSegmentedToggle;
