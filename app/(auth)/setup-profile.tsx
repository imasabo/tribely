import { View } from 'react-native';

import { ProfileSetupScreen } from '@/features/auth/screens/ProfileSetupScreen';
import { screenStyle } from '@/constants/theme';

export default function SetupProfileRoute() {
  return (
    <View style={screenStyle}>
      <ProfileSetupScreen />
    </View>
  );
}
