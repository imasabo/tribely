import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { colors } from '@/constants/theme';

export interface LessonChatMember {
  id: string;
  name: string;
  initials: string;
  role: 'host' | 'learner';
}

interface LessonChatMembersSheetProps {
  visible: boolean;
  members: LessonChatMember[];
  onClose: () => void;
  onMemberPress?: (member: LessonChatMember) => void;
}

function MemberRow({
  member,
  onPress,
}: {
  member: LessonChatMember;
  onPress?: () => void;
}) {
  const content = (
    <View className="flex-row items-center gap-3 py-3">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
        <Text className="text-sm font-semibold text-white">{member.initials}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-foreground">{member.name}</Text>
        <Text className="text-xs text-muted-foreground">
          {member.role === 'host' ? 'Host' : 'Learner'}
        </Text>
      </View>
      {member.role === 'host' ? (
        <View className="rounded-full bg-secondary px-2 py-0.5">
          <Text className="text-[10px] font-medium text-primary">Teacher</Text>
        </View>
      ) : null}
      {onPress ? (
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-80">
        {content}
      </Pressable>
    );
  }

  return content;
}

export function LessonChatMembersSheet({
  visible,
  members,
  onClose,
  onMemberPress,
}: LessonChatMembersSheetProps) {
  const insets = useSafeAreaInsets();
  const hosts = members.filter((m) => m.role === 'host');
  const learners = members.filter((m) => m.role === 'learner');

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      accessibilityLabel="Close members list"
      sheetClassName="max-h-[70%] px-5 pt-3"
      sheetStyle={{ paddingBottom: insets.bottom + 16 }}>
      <View className="mb-4 items-center">
        <View className="h-1 w-10 rounded-full bg-border" />
      </View>

      <Text className="mb-1 text-xl font-bold text-foreground">Members</Text>
      <Text className="mb-4 text-sm text-muted-foreground">
        {members.length} people in this lesson chat
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {hosts.length > 0 ? (
          <View className="mb-2">
            <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Host
            </Text>
            {hosts.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                onPress={onMemberPress ? () => onMemberPress(member) : undefined}
              />
            ))}
          </View>
        ) : null}

        {learners.length > 0 ? (
          <View>
            <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Learners
            </Text>
            {learners.map((member, index) => (
              <View key={member.id}>
                {index > 0 ? <View className="h-px bg-border" /> : null}
                <MemberRow
                  member={member}
                  onPress={onMemberPress ? () => onMemberPress(member) : undefined}
                />
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </BottomSheet>
  );
}
