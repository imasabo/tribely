import { router } from 'expo-router';
import { Alert } from 'react-native';

type ProfileUserMenuOptions = {
  userId: string;
  displayName: string;
  blocked: boolean;
  onBlock: () => void;
  onUnblock: () => void;
};

export function showProfileUserMenu({
  userId,
  displayName,
  blocked,
  onBlock,
  onUnblock,
}: ProfileUserMenuOptions) {
  const openReport = () => {
    router.push({
      pathname: '/report-user',
      params: { userId, displayName },
    });
  };

  if (blocked) {
    Alert.alert(displayName, undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Report user', onPress: openReport },
      {
        text: 'Unblock',
        onPress: () => {
          Alert.alert(
            `Unblock ${displayName}?`,
            'They will be able to view your profile and send you friend requests again.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Unblock', onPress: onUnblock },
            ]
          );
        },
      },
    ]);
    return;
  }

  Alert.alert(displayName, undefined, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Report user', onPress: openReport },
    {
      text: 'Block user',
      style: 'destructive',
      onPress: () => {
        Alert.alert(
          `Block ${displayName}?`,
          "They won't be able to see your profile or send you friend requests. You can unblock them anytime in Settings.",
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Block', style: 'destructive', onPress: onBlock },
          ]
        );
      },
    },
  ]);
}
