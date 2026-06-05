import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  className,
  style,
}: SkeletonProps) {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => {
    const bandWidth = Math.max(layoutWidth * 0.55, 48);
    return {
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [-bandWidth, layoutWidth]),
        },
      ],
    };
  }, [layoutWidth]);

  return (
    <View
      className={className}
      onLayout={(event) => setLayoutWidth(event.nativeEvent.layout.width)}
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}>
      {layoutWidth > 0 ? (
        <Animated.View
          style={[
            styles.shimmerBand,
            { width: Math.max(layoutWidth * 0.55, 48) },
            shimmerStyle,
          ]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.65)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.muted,
    overflow: 'hidden',
  },
  shimmerBand: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
  },
});
