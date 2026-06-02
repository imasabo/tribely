import { Redirect, Stack } from 'expo-router';

import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthLayout() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
