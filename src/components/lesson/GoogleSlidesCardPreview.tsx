import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import { colors } from '@/constants/theme';

import { SlidePreview } from './SlidePreview';

interface GoogleSlidesCardPreviewProps {
  /** Primary slide accent — used when `colors` is omitted. */
  accentColor?: string;
  colors?: [string, string, string];
  /** `compact` for 64×64 list thumbnails; `featured` for large card headers. */
  variant?: 'compact' | 'featured';
  className?: string;
}

function CompactSlideDeck({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <View
      className={`relative h-full w-full overflow-hidden rounded-xl ${className ?? ''}`}
      style={{ backgroundColor: color }}>
      {[28, 52, 76].map((top) => (
        <View
          key={top}
          className="absolute left-[10%] right-[10%] h-px bg-white/15"
          style={{ top: `${top}%` }}
        />
      ))}
      <View className="absolute left-1.5 right-1.5 top-1.5">
        <View className="mb-0.5 h-1 w-7 rounded-full bg-white/85" />
        <View className="h-0.5 w-9 rounded-full bg-white/50" />
        <View className="mt-0.5 h-0.5 w-5 rounded-full bg-white/35" />
      </View>
      <View className="absolute bottom-1.5 left-1.5 right-1.5 flex-row gap-0.5">
        {[0.85, 0.55, 0.35].map((opacity, i) => (
          <View
            key={i}
            className="h-2 flex-1 rounded-sm bg-white/25"
            style={{ opacity: opacity + 0.1 }}
          />
        ))}
      </View>
      <View className="absolute bottom-1 right-1 h-3.5 w-3.5 items-center justify-center rounded bg-black/25">
        <Feather name="layout" size={7} color="#fff" />
      </View>
    </View>
  );
}

/** Lightweight list-card thumbnail — full deck loads on lesson detail. */
export function GoogleSlidesCardPreview({
  accentColor = colors.primary,
  colors: slideColors,
  variant = 'featured',
  className,
}: GoogleSlidesCardPreviewProps) {
  const palette: [string, string, string] =
    slideColors ?? [accentColor, accentColor, accentColor];

  if (variant === 'compact') {
    return <CompactSlideDeck color={palette[0]} className={className} />;
  }

  return <SlidePreview colors={palette} className={className} />;
}
