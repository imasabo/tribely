import { View } from 'react-native';

interface SlidePreviewProps {
  colors: [string, string, string];
  className?: string;
}

export function SlidePreview({ colors, className }: SlidePreviewProps) {
  return (
    <View
      className={`relative h-full w-full overflow-hidden rounded-xl ${className ?? ''}`}
      style={{ backgroundColor: colors[0] }}>
      {[20, 40, 60, 80].map((top) => (
        <View
          key={top}
          className="absolute left-[10%] right-[10%] h-px bg-white/20"
          style={{ top: `${top}%` }}
        />
      ))}
      <View className="absolute left-3 right-3 top-3">
        <View className="mb-1.5 h-2 w-16 rounded-full bg-white/80" />
        <View className="mb-1 h-1.5 w-20 rounded-full bg-white/50" />
        <View className="h-1.5 w-12 rounded-full bg-white/40" />
      </View>
      <View className="absolute bottom-3 left-3 right-3 flex-row gap-1">
        {[0.7, 0.5, 0.4].map((opacity, i) => (
          <View key={i} className="h-1 flex-1 rounded-full bg-white" style={{ opacity }} />
        ))}
      </View>
      <View className="absolute bottom-5 left-3 right-3 flex-row gap-1">
        {[0, 1, 2].map((i) => (
          <View key={i} className="h-3.5 flex-1 rounded-md bg-white/15" />
        ))}
      </View>
    </View>
  );
}
