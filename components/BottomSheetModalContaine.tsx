import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  forwardRef,
} from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

export type BottomSheetModalContainerRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  children: React.ReactNode;
};

const BottomSheetModalContainer = forwardRef<
  BottomSheetModalContainerRef,
  Props
>(({ children }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Bottom sheet index:', index);
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetModalRef.current?.present(),
    close: () => bottomSheetModalRef.current?.close(),
  }));

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: '#212121' }}
          handleIndicatorStyle={{ backgroundColor: '#616161' }}
        >
          <BottomSheetView style={styles.contentContainer}>
            {children}
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#212121',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});

export default BottomSheetModalContainer;
