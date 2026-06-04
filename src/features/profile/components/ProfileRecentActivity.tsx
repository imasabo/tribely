import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { ProfileActivityItem } from '@/features/profile/types';

interface ProfileRecentActivityProps {
  title?: string;
  items: ProfileActivityItem[];
}

type ActivityRole = 'taught' | 'learned';

function resolveRole(item: ProfileActivityItem): ActivityRole | null {
  if (item.role) return item.role;
  if (/\bTaught\b/i.test(item.subtitle)) return 'taught';
  if (/\bLearned\b/i.test(item.subtitle)) return 'learned';
  return null;
}

function resolveDateLabel(item: ProfileActivityItem): string {
  return item.subtitle.replace(/\s*·\s*(Taught|Learned)\s*$/i, '').trim();
}

function RoleBadge({ role }: { role: ActivityRole }) {
  const isTaught = role === 'taught';

  return (
    <View
      className={`rounded-full px-2 py-0.5 ${isTaught ? 'bg-secondary' : 'bg-muted'}`}>
      <Text
        className={`text-[10px] font-semibold uppercase tracking-wide ${
          isTaught ? 'text-primary' : 'text-muted-foreground'
        }`}>
        {isTaught ? 'Taught' : 'Learned'}
      </Text>
    </View>
  );
}

export function ProfileRecentActivity({
  title = 'Recent activity',
  items,
}: ProfileRecentActivityProps) {
  if (items.length === 0) return null;

  return (
    <View>
      <Text className="mb-3 text-[15px] font-semibold text-foreground">{title}</Text>
      <View className="overflow-hidden rounded-2xl border border-border bg-card">
        {items.map((item, index) => {
          const role = resolveRole(item);
          const dateLabel = resolveDateLabel(item);

          return (
            <View key={`${item.title}-${item.subtitle}`}>
              {index > 0 ? <View className="mx-4 h-px bg-border" /> : null}
              <View className="flex-row items-start justify-between gap-3 px-4 py-3.5">
                <View className="min-w-0 flex-1">
                  <Text className="text-sm font-semibold text-foreground">{item.title}</Text>
                  <View className="mt-1.5 flex-row flex-wrap items-center gap-2">
                    {role ? <RoleBadge role={role} /> : null}
                    <Text className="text-xs text-muted-foreground">{dateLabel}</Text>
                  </View>
                </View>
                {item.rating != null ? (
                  <View className="flex-row items-center gap-1 pt-0.5">
                    <Feather name="star" size={12} color={colors.accent} />
                    <Text className="text-sm font-medium text-foreground">{item.rating}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
