import { Text, View, type ViewProps } from 'react-native';

interface CenteredMessageProps extends ViewProps {
  message: string;
}

export function CenteredMessage({ message, className, ...props }: CenteredMessageProps) {
  return (
    <View
      className={`flex-1 items-center justify-center bg-background px-6 ${className ?? ''}`}
      {...props}>
      <Text className="text-center text-muted-foreground">{message}</Text>
    </View>
  );
}
