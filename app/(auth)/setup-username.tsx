import { View } from 'react-native';

import { UsernameOnboardingScreen } from '@/features/auth/screens/UsernameOnboardingScreen';
import { screenStyle } from '@/constants/theme';

export default function SetupUsernameRoute() {
  return (
    <View style={screenStyle}>
      <UsernameOnboardingScreen />
    </View>
  );
}
