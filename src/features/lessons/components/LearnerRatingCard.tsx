import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { FormTextField } from '@/components/ui/FormTextField';
import { StarRatingPicker } from '@/components/ui/StarRatingPicker';
import { colors } from '@/constants/theme';
import type { LearnerToRate } from '@/services/learnerRatings.service';

const NOTE_CHAR_LIMIT = 280;

interface LearnerRatingCardProps {
  learner: LearnerToRate;
  submitting: boolean;
  onSubmit: (rating: number, reviewSnippet?: string) => Promise<void>;
}

export function LearnerRatingCard({ learner, submitting, onSubmit }: LearnerRatingCardProps) {
  const { learnerName, learnerInitials, existingRating } = learner;
  const [rating, setRating] = useState<number | undefined>(existingRating?.rating);
  const [note, setNote] = useState(existingRating?.reviewSnippet ?? '');
  const [error, setError] = useState<string | null>(null);

  const isRated = existingRating != null;

  const handleSubmit = async () => {
    if (rating == null) {
      setError('Select a star rating to continue.');
      return;
    }
    setError(null);
    try {
      await onSubmit(rating, note.trim() || undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save rating');
    }
  };

  return (
    <View className="rounded-2xl border border-border bg-card p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
          <Text className="text-sm font-semibold text-white">{learnerInitials}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{learnerName}</Text>
          {isRated ? (
            <Text className="mt-0.5 text-xs text-muted-foreground">
              Rated · {existingRating.createdAtLabel}
            </Text>
          ) : (
            <Text className="mt-0.5 text-xs text-muted-foreground">Awaiting your rating</Text>
          )}
        </View>
        {isRated && existingRating ? (
          <View className="flex-row items-center gap-0.5 rounded-full bg-accent/10 px-2 py-1">
            <Feather name="star" size={11} color={colors.accent} />
            <Text className="text-xs font-medium text-accent">{existingRating.rating}</Text>
          </View>
        ) : null}
      </View>

      {isRated && existingRating?.reviewSnippet ? (
        <Text className="mt-3 text-sm leading-5 text-muted-foreground">
          {existingRating.reviewSnippet}
        </Text>
      ) : null}

      {!isRated ? (
        <View className="mt-4">
          <Text className="mb-2 text-sm font-medium text-foreground">Rating</Text>
          <StarRatingPicker value={rating} onChange={setRating} />
          <View className="mt-4 gap-2">
            <Text className="text-sm font-medium text-foreground">Private note (optional)</Text>
            <FormTextField
              variant="multiline"
              value={note}
              onChangeText={setNote}
              placeholder="How did they participate?"
              maxLength={NOTE_CHAR_LIMIT}
              style={{ minHeight: 88 }}
            />
          </View>
          {error ? <Text className="mt-2 text-sm text-destructive">{error}</Text> : null}
          <Button
            title="Save rating"
            className="mt-4"
            fullWidth
            loading={submitting}
            onPress={() => void handleSubmit()}
          />
        </View>
      ) : (
        <Text className="mt-3 text-xs text-muted-foreground">
          This rating appears on their profile as feedback from you.
        </Text>
      )}
    </View>
  );
}
