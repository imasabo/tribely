import { Pressable } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { ScreenStickyHeader } from '@/components/ui/ScreenStickyHeader';

interface HomeTopBarProps {
  avatarInitials: string;
  onNotificationsPress?: () => void;
  onAvatarPress?: () => void;
}

export function HomeTopBar({
  avatarInitials,
  onNotificationsPress,
  onAvatarPress,
}: HomeTopBarProps) {
  return (
    <ScreenStickyHeader>
      <PageHeader
        title="Tribely"
        trailing={
          <>
            <IconButton icon="bell" showBadge onPress={onNotificationsPress} />
            <Pressable onPress={onAvatarPress} disabled={!onAvatarPress}>
              <Avatar initials={avatarInitials} />
            </Pressable>
          </>
        }
      />
    </ScreenStickyHeader>
  );
}
