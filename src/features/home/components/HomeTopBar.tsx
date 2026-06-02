import { Pressable } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { ScreenStickyHeader } from '@/components/ui/ScreenStickyHeader';
import { SearchBar } from '@/components/ui/SearchBar';

interface HomeTopBarProps {
  greeting: string;
  title: string;
  searchPlaceholder?: string;
  avatarInitials: string;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  onAvatarPress?: () => void;
}

export function HomeTopBar({
  greeting,
  title,
  searchPlaceholder = 'Search lessons or teachers…',
  avatarInitials,
  onSearchPress,
  onNotificationsPress,
  onAvatarPress,
}: HomeTopBarProps) {
  return (
    <ScreenStickyHeader>
      <PageHeader
        className="mb-4"
        subtitle={greeting}
        title={title}
        trailing={
          <>
            <IconButton icon="bell" showBadge onPress={onNotificationsPress} />
            <Pressable onPress={onAvatarPress} disabled={!onAvatarPress}>
              <Avatar initials={avatarInitials} />
            </Pressable>
          </>
        }
      />
      <SearchBar placeholder={searchPlaceholder} onPress={onSearchPress} />
    </ScreenStickyHeader>
  );
}
