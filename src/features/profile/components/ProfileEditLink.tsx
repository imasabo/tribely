import { Feather } from '@expo/vector-icons';

import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/theme';

interface ProfileEditLinkProps {
  onPress: () => void;
}

export function ProfileEditLink({ onPress }: ProfileEditLinkProps) {
  return (
    <Button
      title="Edit"
      variant="outline"
      size="sm"
      onPress={onPress}
      accessibilityLabel="Edit profile"
      icon={<Feather name="edit-2" size={14} color={colors.foreground} />}
      className="px-3 py-2"
    />
  );
}
