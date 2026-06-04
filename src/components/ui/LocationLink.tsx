import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type PressableProps, type ViewProps } from 'react-native';

import { colors } from '@/constants/theme';

interface LocationLinkProps extends Omit<PressableProps, 'children'> {
  label: string;
  className?: string;
  /** Matches `text-sm` metadata rows (e.g. lessons found). Default is slightly bolder. */
  variant?: 'default' | 'sm';
}

export function LocationLink({
  label,
  className,
  style,
  variant = 'default',
  onPress,
  ...props
}: LocationLinkProps) {
  const isSm = variant === 'sm';
  const isInteractive = onPress != null;
  const iconColor = isSm && !isInteractive ? colors.mutedForeground : colors.primary;
  const rootStyle = [styles.root, isSm && styles.rootSm, style];

  const content = (
    <>
      <Feather name="map-pin" size={isSm ? 12 : 14} color={iconColor} />
      <Text
        className={isSm ? 'text-sm text-muted-foreground' : undefined}
        style={isSm ? undefined : styles.label}>
        {label}
      </Text>
      {isInteractive ? (
        <Feather name="chevron-right" size={isSm ? 12 : 14} color={colors.primary} />
      ) : null}
    </>
  );

  if (isInteractive) {
    return (
      <Pressable
        style={rootStyle}
        className={className}
        hitSlop={8}
        onPress={onPress}
        {...props}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={rootStyle} className={className} {...(props as ViewProps)}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    minHeight: 24,
  },
  rootSm: {
    gap: 4,
    minHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});
