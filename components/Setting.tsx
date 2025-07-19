import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { ModalContainer } from './ModalContainer';
import { ChevronLeft, X } from 'lucide-react-native';

const Setting = ({
  isVisible,
  toggleSetting,
}: {
  isVisible: boolean;
  toggleSetting: () => void;
}) => {
  return (
    <ModalContainer isVisible={isVisible} onClose={toggleSetting}>
      <View style={[{ backgroundColor: '#151518', flex: 1, padding: 10 }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSetting}>
            <ChevronLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Setting</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Settings</Text>

          <Text style={styles.comingSoon}>⚙️ Features coming soon...</Text>

          <Text style={styles.version}>
            App Version: <Text style={styles.bold}>N/A</Text>
          </Text>

          <Text style={styles.footer}>
            Made with ☕ & ❤️ by <Text style={styles.bold}>pushparaj21</Text>
          </Text>
        </View>
      </View>
    </ModalContainer>
  );
};

export default Setting;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#F1F1F1',
    fontWeight: '400',
    marginLeft: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212', // dark theme
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  //   title: {
  //     fontSize: 32,
  //     color: '#A259FF',
  //     marginBottom: 20,
  //     fontWeight: '600',
  //   },
  comingSoon: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
  },
  version: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  bold: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    color: '#aaa',
    textAlign: 'center',
    fontSize: 14,
  },
});
