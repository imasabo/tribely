import { Pressable, Text, View, type ViewProps } from 'react-native';

interface CenteredMessageProps extends ViewProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function CenteredMessage({
  message,
  actionLabel,
  onAction,
  className,
  ...props
}: CenteredMessageProps) {
  return (
    <View
      className={`flex-1 items-center justify-center bg-background px-6 ${className ?? ''}`}
      {...props}>
      <Text className="text-center text-muted-foreground">{message}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} className="mt-4 active:opacity-80">
          <Text className="text-base font-semibold text-primary">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
