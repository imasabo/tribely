import { Feather } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import {
  clampTimeForSelectedDate,
  formatScheduleDate,
  formatScheduleTime,
  isSameCalendarDay,
  startOfToday,
} from '@/lib/lessonSchedule';

type ActivePicker = 'date' | 'time' | null;

interface ScheduleDateTimeFieldsProps {
  date: Date | null;
  time: Date;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: Date) => void;
  dateError?: string;
  timeError?: string;
}

function FieldButton({
  label,
  value,
  placeholder,
  icon,
  onPress,
  hasError,
  expanded,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  icon: 'calendar' | 'clock';
  onPress: () => void;
  hasError?: boolean;
  expanded?: boolean;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <Pressable
        onPress={onPress}
        className={`flex-row items-center gap-3 rounded-xl border bg-muted px-4 py-3.5 active:opacity-90 ${
          hasError ? 'border-destructive' : expanded ? 'border-primary' : 'border-transparent'
        }`}>
        <Feather name={icon} size={18} color={colors.primary} />
        <Text
          className={`flex-1 text-base ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
          {value ?? placeholder}
        </Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.mutedForeground}
        />
      </Pressable>
    </View>
  );
}

function InlinePicker({
  mode,
  value,
  onChange,
  minimumDate,
}: {
  mode: 'date' | 'time';
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  minimumDate?: Date;
}) {
  return (
    <View className="mt-2 overflow-hidden rounded-2xl border border-border bg-card">
      {mode === 'date' && Platform.OS === 'ios' ? (
        <View style={{ height: 340 }}>
          <DateTimePicker
            value={value}
            mode="date"
            display="inline"
            onChange={onChange}
            minimumDate={minimumDate}
            themeVariant="light"
            accentColor={colors.primary}
          />
        </View>
      ) : (
        <DateTimePicker
          value={value}
          mode={mode}
          display="spinner"
          onChange={onChange}
          minimumDate={minimumDate}
          themeVariant="light"
          accentColor={colors.primary}
        />
      )}
    </View>
  );
}

export function ScheduleDateTimeFields({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: ScheduleDateTimeFieldsProps) {
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  const timeMinimumDate = useMemo(() => {
    if (!date || !isSameCalendarDay(date, new Date())) return undefined;
    const now = new Date();
    now.setSeconds(0, 0);
    return now;
  }, [date]);

  const applyDateChange = (selected: Date) => {
    onDateChange(selected);
    onTimeChange(clampTimeForSelectedDate(selected, time));
  };

  const applyTimeChange = (selected: Date) => {
    if (!date) {
      onTimeChange(selected);
      return;
    }
    onTimeChange(clampTimeForSelectedDate(date, selected));
  };

  const handlePickerChange =
    (mode: 'date' | 'time') => (event: DateTimePickerEvent, selected?: Date) => {
      if (event.type === 'dismissed') {
        setActivePicker(null);
        return;
      }

      if (selected) {
        if (mode === 'date') applyDateChange(selected);
        else applyTimeChange(selected);
      }

      if (Platform.OS === 'android') {
        setActivePicker(null);
      }
    };

  const openPicker = (mode: 'date' | 'time') => {
    setActivePicker((current) => (current === mode ? null : mode));
  };

  return (
    <View className="gap-4">
      <View>
        <FieldButton
          label="Date"
          value={date ? formatScheduleDate(date) : null}
          placeholder="Select date"
          icon="calendar"
          onPress={() => openPicker('date')}
          hasError={Boolean(dateError)}
          expanded={activePicker === 'date'}
        />
        {dateError ? <Text className="mt-1 text-xs text-destructive">{dateError}</Text> : null}
        {Platform.OS === 'ios' && activePicker === 'date' ? (
          <InlinePicker
            mode="date"
            value={date ?? new Date()}
            onChange={handlePickerChange('date')}
            minimumDate={startOfToday()}
          />
        ) : null}
      </View>

      <View>
        <FieldButton
          label="Time"
          value={formatScheduleTime(time)}
          placeholder="Select time"
          icon="clock"
          onPress={() => openPicker('time')}
          hasError={Boolean(timeError)}
          expanded={activePicker === 'time'}
        />
        {timeError ? <Text className="mt-1 text-xs text-destructive">{timeError}</Text> : null}
        {Platform.OS === 'ios' && activePicker === 'time' ? (
          <InlinePicker
            mode="time"
            value={time}
            onChange={handlePickerChange('time')}
            minimumDate={timeMinimumDate}
          />
        ) : null}
      </View>

      {Platform.OS === 'android' && activePicker === 'date' ? (
        <DateTimePicker
          value={date ?? new Date()}
          mode="date"
          display="default"
          onChange={handlePickerChange('date')}
          minimumDate={startOfToday()}
        />
      ) : null}

      {Platform.OS === 'android' && activePicker === 'time' ? (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handlePickerChange('time')}
          minimumDate={timeMinimumDate}
        />
      ) : null}
    </View>
  );
}
