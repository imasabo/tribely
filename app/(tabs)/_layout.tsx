import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';

import { TabBar } from '@/components/navigation/TabBar';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { screenStyle, stackContentStyle } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

export default function TabsLayout() {
  const { loading, profileLoading, isAuthenticated, needsUsernameOnboarding } =
    useAuth();

  if (loading || (isAuthenticated && profileLoading)) {
    return (
      <View style={screenStyle}>
        <LoadingScreen />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (needsUsernameOnboarding) {
    return <Redirect href="/(auth)/setup-username" />;
  }

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: stackContentStyle,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
