import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenStickyHeaderProps extends ViewProps {
  topOffset?: number;
}

export function ScreenStickyHeader({
  children,
  topOffset = 8,
  className,
  style,
  ...props
}: ScreenStickyHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`z-10 bg-background/95 px-5 pb-2 ${className ?? ''}`}
      style={[{ paddingTop: insets.top + topOffset }, style]}
      {...props}>
      {children}
    </View>
  );
}
