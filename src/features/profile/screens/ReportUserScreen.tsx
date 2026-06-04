import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormTextField } from '@/components/ui/FormTextField';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/theme';
import { userReportsService } from '@/services/userReports.service';
import { useAuth } from '@/providers/AuthProvider';
import {
  USER_REPORT_REASONS,
  type UserReportReasonId,
} from '@/types/userReport';

export function ReportUserScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ userId: string; displayName: string }>();

  const userId = typeof params.userId === 'string' ? params.userId : '';
  const displayName =
    typeof params.displayName === 'string' ? params.displayName : 'this user';

  const [loading, setLoading] = useState(true);
  const [alreadyReported, setAlreadyReported] = useState(false);
  const [selectedReason, setSelectedReason] = useState<UserReportReasonId | null>(null);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!user?.uid || !userId) {
        if (!cancelled) setLoading(false);
        return;
      }

      const reported = await userReportsService.hasReported(user.uid, userId);
      if (!cancelled) {
        setAlreadyReported(reported);
        setLoading(false);
      }
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, [user?.uid, userId]);

  const handleSubmit = useCallback(async () => {
    if (!user?.uid || !userId || !selectedReason || submitting) return;

    setSubmitting(true);
    try {
      await userReportsService.submitReport(user.uid, userId, selectedReason, details);
      Alert.alert(
        'Report submitted',
        'Thanks for helping keep Tribely safe. Our team will review this report.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Something went wrong', 'Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  }, [user?.uid, userId, selectedReason, details, submitting]);

  if (!userId) {
    return null;
  }

  if (loading) {
    return <LoadingScreen message="Loading…" />;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View
        className="flex-row items-center gap-3 border-b border-border px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-9 w-9 items-center justify-center rounded-full bg-muted active:opacity-80">
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text className="flex-1 text-[17px] font-semibold text-foreground">Report user</Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {alreadyReported ? (
          <View className="rounded-2xl border border-border bg-card px-4 py-4">
            <Text className="text-[15px] font-medium text-foreground">
              You already reported {displayName}
            </Text>
            <Text className="mt-2 text-sm leading-5 text-muted-foreground">
              We received your earlier report and are reviewing it. You don't need to submit
              another one unless something new happened.
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-sm leading-5 text-muted-foreground">
              Why are you reporting <Text className="font-semibold text-foreground">{displayName}</Text>?
              Reports are confidential and help us keep the community safe.
            </Text>

            <View className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
              {USER_REPORT_REASONS.map((reason, index) => {
                const selected = selectedReason === reason.id;
                return (
                  <View key={reason.id}>
                    {index > 0 ? <View className="mx-4 h-px bg-border" /> : null}
                    <Pressable
                      onPress={() => setSelectedReason(reason.id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={reason.label}
                      className="flex-row items-center gap-3 px-4 py-3.5 active:opacity-80">
                      <View className="min-w-0 flex-1">
                        <Text className="text-[15px] font-medium text-foreground">
                          {reason.label}
                        </Text>
                      </View>
                      {selected ? (
                        <Feather name="check" size={18} color={colors.primary} />
                      ) : null}
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <Text className="mb-2 mt-6 text-[15px] font-semibold text-foreground">
              Additional details (optional)
            </Text>
            <FormTextField
              value={details}
              onChangeText={setDetails}
              placeholder="Tell us more about what happened…"
              multiline
            />

            <Pressable
              onPress={() => void handleSubmit()}
              disabled={!selectedReason || submitting}
              accessibilityRole="button"
              accessibilityLabel="Submit report"
              className={`mt-6 items-center rounded-xl py-3.5 active:opacity-80 ${
                selectedReason && !submitting ? 'bg-primary' : 'bg-muted'
              }`}>
              <Text
                className={`text-[15px] font-semibold ${
                  selectedReason && !submitting
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground'
                }`}>
                {submitting ? 'Submitting…' : 'Submit report'}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
