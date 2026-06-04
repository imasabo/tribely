import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import {
  PROFILE_COVER_PULL_STRETCH_MAX,
  PROFILE_GRADIENT_BODY_HEIGHT,
} from '@/features/profile/lib/profileCoverMetrics';

export { PROFILE_GRADIENT_BODY_HEIGHT } from '@/features/profile/lib/profileCoverMetrics';

interface ProfileCoverProps {
  scrollY: SharedValue<number>;
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
}

export function ProfileCover({ scrollY, headerStart, headerEnd }: ProfileCoverProps) {
  const insets = useSafeAreaInsets();
  const baseHeight = PROFILE_GRADIENT_BODY_HEIGHT + insets.top;
  const hasHeaderControls = headerStart != null || headerEnd != null;

  const shellStyle = useAnimatedStyle(() => {
    const y = scrollY.value;
    const stretch = y < 0 ? -y : 0;

    const translateY =
      y < 0
        ? y
        : interpolate(y, [0, baseHeight], [0, -baseHeight * 0.4], Extrapolation.CLAMP);

    return {
      height: baseHeight + stretch,
      transform: [{ translateY }],
    };
  });

  const innerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-PROFILE_COVER_PULL_STRETCH_MAX, 0],
      [2.2, 1],
      Extrapolation.CLAMP
    );
    const topOffset = ((scale - 1) * baseHeight) / 2;

    return {
      transform: [{ translateY: -topOffset }, { scaleY: scale }],
    };
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.shell, shellStyle]}
      accessibilityElementsHidden>
      <Animated.View style={[styles.inner, { height: baseHeight }, innerStyle]}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={[styles.gradient, { paddingTop: insets.top }]}>
          {hasHeaderControls ? (
            <View pointerEvents="box-none" style={styles.controlsRow}>
              <View pointerEvents="auto" style={styles.controlSlot}>
                {headerStart}
              </View>
              <View pointerEvents="auto" style={styles.controlSlot}>
                {headerEnd}
              </View>
            </View>
          ) : null}
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  inner: {
    width: '100%',
  },
  gradient: {
    flex: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    marginTop: 4,
    paddingHorizontal: 20,
  },
  controlSlot: {
    minWidth: 36,
  },
});
