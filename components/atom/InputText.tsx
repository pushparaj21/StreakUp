import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import React, { use, useState } from 'react';
import { ModalContainer } from '../ModalContainer';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

type InputTextType = {
  value: string;

  onChangeText: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
};

type InputTextModal = {
  value: string | null;
  onClick: () => void;
  label: string;
  modalTitle: string;
  children: React.ReactNode;
};

export default function InputText({
  value,
  onChangeText,
  label,
  secureTextEntry = false,
}: InputTextType) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        style={styles.input}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}
export function InputTextWithLeftArrowModal({
  value,
  onClick,
  label,
  modalTitle,
  children,
}: InputTextModal) {
  const [isVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isVisible);
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <Pressable onPress={toggleModal}>
          <Text style={styles.input}>{value} </Text>
          <ChevronRight
            size={20}
            color="#fff"
            style={{
              position: 'absolute',
              right: 15,
              top: '50%',
              transform: [{ translateY: '-50%' }],
            }}
          />
        </Pressable>
      </View>
      <ModalContainer isVisible={isVisible} onClose={toggleModal}>
        <View style={[{ backgroundColor: '#151518', flex: 1, padding: 10 }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleModal}>
              <ChevronLeft size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{modalTitle}</Text>
            <View style={{ width: 24 }} />
          </View>
          {children}
        </View>
      </ModalContainer>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#F1F1F1',
    fontWeight: '400',
    marginLeft: 30,
  },
  container: {},
  input: {
    borderColor: '#27272A',
    backgroundColor: '#09090B',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    color: '#F1F1F1',
    fontSize: 16,
  },
  label: {
    color: '#F1F1F1',
    paddingLeft: 10,
    paddingBottom: 8,
    paddingTop: 10,
    fontSize: 12,
    marginTop: 8,
  },
});
