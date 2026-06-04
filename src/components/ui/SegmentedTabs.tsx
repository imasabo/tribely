import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export interface SegmentedTabOption<T extends string> {
  id: T;
  label: string;
  badge?: number;
}

interface SegmentedTabsProps<T extends string> {
  options: SegmentedTabOption<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}

const activeSegmentShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 2,
  elevation: 2,
} as const;

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <View className={`flex-row rounded-xl bg-muted p-1 ${className ?? ''}`}>
      {options.map((option) => {
        const isActive = option.id === value;

        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={option.label}
            style={[styles.segment, isActive && styles.segmentActive]}>
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
              {option.label}
            </Text>
            {option.badge != null && option.badge > 0 ? (
              <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
                <Text
                  style={[
                    styles.badgeText,
                    isActive ? styles.badgeTextActive : styles.badgeTextInactive,
                  ]}>
                  {option.badge}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    paddingVertical: 10,
  },
  segmentActive: {
    backgroundColor: colors.card,
    ...activeSegmentShadow,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.foreground,
  },
  labelInactive: {
    color: colors.mutedForeground,
  },
  badge: {
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeActive: {
    backgroundColor: colors.primary,
  },
  badgeInactive: {
    backgroundColor: 'rgba(113, 113, 122, 0.25)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  badgeTextActive: {
    color: '#fff',
  },
  badgeTextInactive: {
    color: colors.mutedForeground,
  },
});
