import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

type TabIcon = 'home' | 'discover' | 'teach' | 'profile';

const TAB_CONFIG: { name: string; label: string; icon: TabIcon }[] = [
  { name: 'index', label: 'Home', icon: 'home' },
  { name: 'discover', label: 'Discover', icon: 'discover' },
  { name: 'teach', label: 'Teach', icon: 'teach' },
  { name: 'profile', label: 'Profile', icon: 'profile' },
];

function TabIconView({ icon, active }: { icon: TabIcon; active: boolean }) {
  const color = active ? colors.primary : colors.mutedForeground;
  if (icon === 'teach') {
    return (
      <View className="-mt-5 h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-md">
        <Feather name="plus-square" size={20} color="#fff" />
      </View>
    );
  }
  const featherName =
    icon === 'home' ? 'home' : icon === 'discover' ? 'compass' : 'user';
  return <Feather name={featherName} size={22} color={color} />;
}

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-border bg-background/95"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      <View className="flex-row items-center justify-around pt-2">
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[index];
          const active = state.index === index;
          const isTeach = config.icon === 'teach';

          const onPress = () => {
            if (isTeach) {
              router.push('/create');
              return;
            }
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
              key={route.key}
              onPress={onPress}
              className="relative items-center px-5 py-1.5">
              {active && !isTeach && (
                <View className="absolute top-0 h-0.5 w-4 rounded-full bg-primary" />
              )}
              <TabIconView icon={config.icon} active={active || isTeach} />
              <Text
                className={`mt-1 text-[10px] ${active || isTeach ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
