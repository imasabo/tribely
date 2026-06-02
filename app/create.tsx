import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';

export default function CreateLessonScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-foreground/5">
          <Feather name="x" size={18} color="#1F2937" />
        </Pressable>
        <Text className="text-base font-semibold text-foreground">Create Lesson</Text>
        <View className="w-9" />
      </View>

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="mb-6 text-[22px] font-bold text-foreground">
          Share what you know
        </Text>

        <View className="mb-4 gap-1.5">
          <Text className="text-sm font-medium text-foreground">Lesson title</Text>
          <TextInput
            placeholder="e.g. Intro to Python for Beginners"
            placeholderTextColor="#6B7280"
            className="rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
          />
        </View>

        <View className="mb-4 gap-1.5">
          <Text className="text-sm font-medium text-foreground">Description</Text>
          <TextInput
            placeholder="What will learners take away?"
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={4}
            className="min-h-[100px] rounded-xl bg-muted px-4 py-3.5 text-base text-foreground"
            textAlignVertical="top"
          />
        </View>

        <Pressable className="mb-6 flex-row items-center gap-3 rounded-2xl border border-dashed border-primary bg-secondary p-4">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Feather name="upload" size={22} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-primary">Upload PowerPoint</Text>
            <Text className="text-xs text-muted-foreground">Required · .pptx up to 50MB</Text>
          </View>
        </Pressable>

        <View className="mb-4 flex-row gap-3">
          {['30 min', '45 min', '60 min'].map((d, i) => (
            <Pressable
              key={d}
              className={`flex-1 rounded-xl border py-3 ${i === 2 ? 'border-primary bg-secondary' : 'border-border bg-card'}`}>
              <Text
                className={`text-center text-sm font-medium ${i === 2 ? 'text-primary' : 'text-foreground'}`}>
                {d}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button title="Publish Lesson" fullWidth onPress={() => router.replace('/(tabs)')} />
      </ScrollView>
    </View>
  );
}
