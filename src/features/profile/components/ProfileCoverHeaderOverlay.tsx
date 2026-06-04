import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileCoverHeaderOverlayProps {
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
}

/** Header actions above the scroll view so taps are not blocked by ScrollView. */
export function ProfileCoverHeaderOverlay({
  headerStart,
  headerEnd,
}: ProfileCoverHeaderOverlayProps) {
  const insets = useSafeAreaInsets();

  if (headerStart == null && headerEnd == null) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.root, { paddingTop: insets.top }]}>
      <View pointerEvents="box-none" style={styles.row}>
        <View pointerEvents="auto" style={styles.slot}>
          {headerStart}
        </View>
        <View pointerEvents="auto" style={styles.slot}>
          {headerEnd}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    marginTop: 4,
    paddingHorizontal: 20,
  },
  slot: {
    minWidth: 36,
  },
});
