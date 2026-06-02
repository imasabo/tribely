import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text className="text-xl font-bold text-foreground">This screen doesn&apos;t exist.</Text>
      <Link href="/" className="mt-4 pt-4">
        <Text className="text-base text-primary">Go to home screen</Text>
      </Link>
    </View>
  );
}
