import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { LessonChatMessage } from '@/types/lessonChat';

interface LessonChatMessageBubbleProps {
  message: LessonChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
  showSenderName: boolean;
}

export function LessonChatMessageBubble({
  message,
  isOwn,
  showAvatar,
  showSenderName,
}: LessonChatMessageBubbleProps) {
  return (
    <View className={`mb-1 flex-row ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && showAvatar ? (
        <View className="mr-2 mt-auto h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Text className="text-[11px] font-semibold text-white">{message.senderInitials}</Text>
        </View>
      ) : !isOwn ? (
        <View className="mr-2 w-8" />
      ) : null}

      <View className={`max-w-[78%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && showSenderName ? (
          <Text className="mb-1 px-1 text-xs font-medium text-muted-foreground">
            {message.senderName}
          </Text>
        ) : null}
        <View
          className={`px-3.5 py-2.5 ${
            isOwn
              ? 'rounded-2xl rounded-br-md bg-primary'
              : 'rounded-2xl rounded-bl-md border border-border bg-card'
          }`}>
          <Text
            className={`text-[15px] leading-[21px] ${isOwn ? 'text-primary-foreground' : 'text-foreground'}`}>
            {message.body}
          </Text>
        </View>
        <Text
          className={`mt-1 px-1 text-[10px] text-muted-foreground ${isOwn ? 'text-right' : 'text-left'}`}>
          {message.sentAtLabel}
        </Text>
      </View>
    </View>
  );
}
