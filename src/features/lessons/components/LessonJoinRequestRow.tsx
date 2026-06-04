import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import type { LessonJoinRequest } from '@/types/lessonJoinRequest';

interface LessonJoinRequestRowProps {
  request: LessonJoinRequest;
  onAccept: () => void;
  onDecline: () => void;
  actionsDisabled?: boolean;
}

export function LessonJoinRequestRow({
  request,
  onAccept,
  onDecline,
  actionsDisabled,
}: LessonJoinRequestRowProps) {
  return (
    <View className="rounded-xl border border-border bg-card p-3">
      <View className="flex-row items-start gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Text className="text-sm font-semibold text-white">{request.requesterInitials}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-foreground">{request.requesterName}</Text>
          <Text className="text-[11px] text-muted-foreground">{request.requestedAtLabel}</Text>
          {request.message ? (
            <Text className="mt-1.5 text-sm leading-5 text-muted-foreground">{request.message}</Text>
          ) : null}
        </View>
      </View>
      <View className="mt-3 flex-row gap-2">
        <View className="flex-1">
          <Button
            title="Accept"
            size="sm"
            fullWidth
            disabled={actionsDisabled}
            onPress={onAccept}
          />
        </View>
        <Pressable
          onPress={onDecline}
          disabled={actionsDisabled}
          className="flex-1 items-center justify-center rounded-xl border border-border py-2.5 active:opacity-80">
          <Text className="text-sm font-medium text-muted-foreground">Decline</Text>
        </Pressable>
      </View>
    </View>
  );
}
