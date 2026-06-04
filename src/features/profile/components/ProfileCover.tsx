import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
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
}

export function ProfileCover({ scrollY }: ProfileCoverProps) {
  const insets = useSafeAreaInsets();
  const baseHeight = PROFILE_GRADIENT_BODY_HEIGHT + insets.top;

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
          style={[styles.gradient, { paddingTop: insets.top }]}
        />
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
});
