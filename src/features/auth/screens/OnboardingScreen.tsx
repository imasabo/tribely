import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

export function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAuth();

  const goToSignIn = async () => {
    await completeOnboarding();
    router.push('/(auth)/sign-in');
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-2 px-6 pt-2">
        <View className="h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-md">
          <Feather name="zap" size={16} color="#fff" />
        </View>
        <Text className="text-lg font-bold tracking-tight text-foreground">Tribely</Text>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-8 h-64 w-64 overflow-hidden rounded-3xl shadow-2xl">
          <LinearGradient
            colors={[colors.primary, colors.primaryDark, colors.foreground]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, padding: 20 }}>
            <View className="mb-2 rounded-2xl bg-white/20 p-3">
              <View className="mb-1 flex-row items-center gap-2">
                <Text className="text-xs">🎸</Text>
                <View className="h-2 w-20 rounded-full bg-white/70" />
              </View>
              <View className="mb-1 h-1.5 w-28 rounded-full bg-white/40" />
              <View className="h-1.5 w-16 rounded-full bg-white/30" />
            </View>
            <View className="rounded-2xl bg-white/10 p-3">
              <View className="mb-1 flex-row items-center gap-2">
                <Text className="text-xs">🐍</Text>
                <View className="h-2 w-24 rounded-full bg-white/70" />
              </View>
              <View className="h-1.5 w-20 rounded-full bg-white/40" />
            </View>
            <View className="absolute bottom-5 left-5 right-5 rounded-2xl bg-accent/80 p-2.5">
              <View className="flex-row items-center gap-2">
                <Text className="text-xs">📍</Text>
                <View className="h-1.5 w-24 rounded-full bg-white/80" />
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="mb-8 flex-row gap-2">
          <View className="h-1.5 w-6 rounded-full bg-primary" />
          <View className="h-1.5 w-1.5 rounded-full bg-border" />
          <View className="h-1.5 w-1.5 rounded-full bg-border" />
        </View>

        <Text className="mb-3 text-center text-[30px] font-bold leading-tight tracking-tight text-foreground">
          Find your{'\n'}learning tribe
        </Text>
        <Text className="text-center text-base leading-relaxed text-muted-foreground">
          Connect with expert neighbors who teach what you want to learn — in person, in 30 or
          60 minutes.
        </Text>
      </View>

      <View className="gap-3 px-6" style={{ paddingBottom: insets.bottom + 24 }}>
        <Button
          title="Get Started"
          fullWidth
          icon={<Feather name="arrow-right" size={18} color="#fff" />}
          onPress={goToSignIn}
        />
        <Pressable onPress={goToSignIn} className="items-center py-2">
          <Text className="text-[15px] text-muted-foreground">I already have an account</Text>
        </Pressable>
      </View>
    </View>
  );
}
