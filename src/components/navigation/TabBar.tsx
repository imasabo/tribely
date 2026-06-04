import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

type TabKey = 'index' | 'discover' | 'messages' | 'profile';
type TabIcon = TabKey | 'teach';

const TABS: { key: TabKey | 'teach'; label: string; icon: TabIcon }[] = [
  { key: 'index', label: 'Home', icon: 'index' },
  { key: 'discover', label: 'Discover', icon: 'discover' },
  { key: 'teach', label: 'Teach', icon: 'teach' },
  { key: 'messages', label: 'Messages', icon: 'messages' },
  { key: 'profile', label: 'Profile', icon: 'profile' },
];

function TabIconView({ icon, active }: { icon: TabIcon; active: boolean }) {
  const color = active ? colors.primary : colors.mutedForeground;

  if (icon === 'teach') {
    return (
      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary">
        <Feather name="plus-square" size={20} color="#fff" />
      </View>
    );
  }

  const featherName =
    icon === 'index'
      ? 'home'
      : icon === 'discover'
        ? 'compass'
        : icon === 'messages'
          ? 'message-circle'
          : 'user';
  return (
    <View className="h-10 w-10 items-center justify-center">
      <Feather name={featherName} size={22} color={color} />
    </View>
  );
}

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-border bg-background/95"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      <View className="flex-row items-end pt-2">
        {TABS.map((tab) => {
          const isTeach = tab.key === 'teach';
          const routeIndex = isTeach ? -1 : state.routes.findIndex((r) => r.name === tab.key);
          const active = !isTeach && state.index === routeIndex;

          const onPress = () => {
            if (isTeach) {
              router.push('/create');
              return;
            }
            const route = state.routes[routeIndex];
            if (!route) return;
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!active && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={tab.key}
              onPress={onPress}
              className="relative flex-1 items-center pb-1">
              {active && (
                <View className="absolute -top-2 h-0.5 w-4 rounded-full bg-primary" />
              )}
              <TabIconView icon={tab.icon} active={active || isTeach} />
              <Text
                className={`mt-1 text-[10px] ${active || isTeach ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
