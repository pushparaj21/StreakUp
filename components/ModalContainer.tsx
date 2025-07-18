import { X } from 'lucide-react-native';
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';

const { height } = Dimensions.get('window');

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  zIndex?: number;
};

const SwipeableModalContainer = ({ isVisible, onClose, children }: Props) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.5}
      propagateSwipe
    >
      <View style={styles.modalContent}>
        <View style={styles.dragIndicator} />
        {children}
      </View>
    </Modal>
  );
};

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
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#212121',
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.9,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#616161',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default SwipeableModalContainer;

export const ModalContainer = ({
  isVisible,
  onClose,
  children,
  zIndex = 10,
}: Props) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0, zIndex: zIndex }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      onBackButtonPress={onClose}
      backdropColor="#00000080"
      backdropOpacity={1}
    >
      {children}
    </Modal>
  );
};
