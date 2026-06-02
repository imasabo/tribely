import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

const teaches = ['Python', 'Data Science', 'ML Basics', 'SQL'];
const learns = ['Guitar', 'Watercolor', 'Spanish', 'Bread Baking'];

const pastLessons = [
  { title: 'Python for Data Science', date: 'May 28, 2026', role: 'Taught', rating: 5 },
  { title: 'Intro to Guitar Chords', date: 'May 15, 2026', role: 'Learned', rating: 5 },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <View className="relative">
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={{ height: 128 }}
        />
        <View className="absolute right-4 top-12">
          <View className="h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Feather name="settings" size={17} color="#fff" />
          </View>
        </View>
      </View>

      <View className="bg-background px-5 pb-5">
        <View className="-mt-10 mb-4 flex-row items-end justify-between">
          <View className="relative">
            <View className="h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary shadow-lg">
              <Text className="text-2xl font-bold text-white">AK</Text>
            </View>
            <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-accent">
              <Feather name="edit-2" size={10} color="#fff" />
            </View>
          </View>
          <View className="rounded-xl border border-border px-4 py-2">
            <Text className="text-sm font-medium text-foreground">Edit Profile</Text>
          </View>
        </View>

        <Text className="text-[22px] font-bold tracking-tight text-foreground">Alex Kim</Text>
        <Text className="mt-0.5 text-sm text-muted-foreground">
          San Francisco, CA · Joined March 2025
        </Text>
        <Text className="mt-2.5 text-[15px] leading-6 text-foreground">
          ML engineer at a startup. I love making complex tech topics approachable.
        </Text>

        <View className="mt-4 flex-row gap-2">
          {[
            { label: 'Rating', value: '4.9', icon: 'star' as const, color: '#D97706' },
            { label: 'Taught', value: '12', icon: 'book-open' as const, color: '#0F766E' },
            { label: 'Students', value: '34', icon: 'users' as const, color: '#7C3AED' },
            { label: 'Reviews', value: '28', icon: 'award' as const, color: '#059669' },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 items-center gap-1 rounded-2xl border border-border bg-card p-3">
              <Feather name={stat.icon} size={16} color={stat.color} />
              <Text className="text-[17px] font-bold text-foreground">{stat.value}</Text>
              <Text className="text-[10px] text-muted-foreground">{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-5 px-5">
        <View>
          <Text className="mb-3 text-[17px] font-semibold text-foreground">I Teach</Text>
          <View className="flex-row flex-wrap gap-2">
            {teaches.map((t) => (
              <View key={t} className="rounded-full bg-secondary px-3.5 py-1.5">
                <Text className="text-[13px] font-medium text-primary">{t}</Text>
              </View>
            ))}
            <View className="rounded-full border border-dashed border-border px-3.5 py-1.5">
              <Text className="text-[13px] text-muted-foreground">+ Add</Text>
            </View>
          </View>
        </View>

        <View>
          <Text className="mb-3 text-[17px] font-semibold text-foreground">I Want to Learn</Text>
          <View className="flex-row flex-wrap gap-2">
            {learns.map((t) => (
              <View key={t} className="rounded-full px-3.5 py-1.5" style={{ backgroundColor: '#FFFBEB' }}>
                <Text className="text-[13px] font-medium text-accent">{t}</Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text className="mb-3 text-[17px] font-semibold text-foreground">Recent Activity</Text>
          {pastLessons.map((item) => (
            <View
              key={item.title}
              className="mb-2 flex-row items-center justify-between rounded-2xl border border-border bg-card p-4">
              <View className="flex-1 pr-2">
                <Text className="text-sm font-semibold text-foreground">{item.title}</Text>
                <Text className="text-xs text-muted-foreground">
                  {item.date} · {item.role}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Feather name="star" size={12} color="#D97706" />
                <Text className="text-sm text-muted-foreground">{item.rating}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
