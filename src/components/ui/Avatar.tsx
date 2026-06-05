import { useState } from 'react';
import { Image, Text, View, type ImageSourcePropType, type ViewProps } from 'react-native';

import { PersonPlaceholderIcon } from '@/components/icons/PersonPlaceholderIcon';
import { colors } from '@/constants/theme';

interface AvatarProps extends ViewProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'inbox';
  imageUri?: string;
  imageSource?: ImageSourcePropType;
  /** Generic person silhouette instead of initials or remote image. */
  personPlaceholder?: boolean;
}

const sizeClasses = {
  sm: { box: 'h-6 w-6', text: 'text-[10px]', dimension: 24, icon: 14 },
  md: { box: 'h-9 w-9', text: 'text-[13px]', dimension: 36, icon: 20 },
  lg: { box: 'h-20 w-20', text: 'text-2xl', dimension: 80, icon: 44 },
  inbox: { box: 'h-12 w-12', text: 'text-sm', dimension: 48, icon: 26 },
};

export function Avatar({
  initials,
  size = 'md',
  imageUri,
  imageSource,
  personPlaceholder = false,
  className,
  ...props
}: AvatarProps) {
  const s = sizeClasses[size];
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean((imageUri || imageSource) && !imageFailed && !personPlaceholder);

  if (personPlaceholder) {
    return (
      <View
        accessibilityLabel={`${initials} avatar`}
        className={`items-center justify-center rounded-full bg-muted ${s.box} ${className ?? ''}`}
        style={{ width: s.dimension, height: s.dimension }}
        {...props}>
        <PersonPlaceholderIcon size={s.icon} color={colors.mutedForeground} />
      </View>
    );
  }

  if (showImage) {
    return (
      <Image
        source={imageSource ?? { uri: imageUri }}
        accessibilityLabel={`${initials} avatar`}
        onError={() => setImageFailed(true)}
        className={`rounded-full bg-muted ${s.box} ${className ?? ''}`}
        style={{ width: s.dimension, height: s.dimension }}
      />
    );
  }

  return (
    <View
      className={`items-center justify-center rounded-full bg-primary ${s.box} ${className ?? ''}`}
      accessibilityLabel={`${initials} avatar`}
      style={{ width: s.dimension, height: s.dimension }}
      {...props}>
      <Text className={`font-semibold text-primary-foreground ${s.text}`}>{initials}</Text>
    </View>
  );
}
