import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

function GoogleIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, isDevAuth } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      // Navigation handled by auth gate in app/index.tsx
    } catch (e) {
      Alert.alert(
        'Sign in failed',
        e instanceof Error
          ? e.message
          : isDevAuth
            ? 'Could not start a dev session.'
            : 'Use a development build (npx expo run:ios) and enable Anonymous Auth in Firebase Console until Google Sign-In is added.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top }}
      keyboardShouldPersistTaps="handled">
      <View className="px-4 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-foreground/5">
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-6">
        <View className="mb-10 h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <Feather name="zap" size={28} color="#fff" />
        </View>
        <Text className="mb-2 text-[28px] font-bold tracking-tight text-foreground">
          Welcome back
        </Text>
        <Text className="mb-8 text-[15px] text-muted-foreground">
          Sign in to continue learning and teaching
        </Text>

        <Pressable
          onPress={handleSignIn}
          disabled={submitting}
          className="mb-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm active:opacity-90">
          <GoogleIcon />
          <Text className="flex-1 text-base font-medium text-foreground">Continue with Google</Text>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>

        <View className="my-4 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-border" />
          <Text className="text-[13px] text-muted-foreground">or</Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        <View className="gap-3">
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-foreground">Email</Text>
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              className="rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
            />
          </View>
          <View className="gap-1.5">
            <Text className="text-sm font-medium text-foreground">Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry
              className="rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
            />
          </View>
          <Button
            title="Sign In"
            fullWidth
            loading={submitting}
            onPress={handleSignIn}
            className="mt-1"
          />
        </View>
      </View>

      <Text className="px-6 pb-10 text-center text-[13px] text-muted-foreground">
        By continuing, you agree to Tribely&apos;s{' '}
        <Text className="text-primary">Terms of Service</Text> and{' '}
        <Text className="text-primary">Privacy Policy</Text>
      </Text>
    </ScrollView>
  );
}
