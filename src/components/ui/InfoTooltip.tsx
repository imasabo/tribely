import { useCallback, useRef, useState, type ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type LayoutRectangle,
} from 'react-native';

import { BOTTOM_SHEET_SCRIM } from '@/components/ui/BottomSheet';
import { colors } from '@/constants/theme';

interface InfoTooltipProps {
  message: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function InfoTooltip({ message, children, actionLabel, onAction }: InfoTooltipProps) {
  const { width: windowWidth } = useWindowDimensions();
  const triggerRef = useRef<View>(null);
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState<LayoutRectangle | null>(null);

  const open = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setVisible(true);
    });
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const handleAction = useCallback(() => {
    close();
    onAction?.();
  }, [close, onAction]);

  const bubbleMaxWidth = Math.min(260, windowWidth - 32);
  const bubbleRight = anchor
    ? Math.max(16, windowWidth - anchor.x - anchor.width)
    : 16;
  const bubbleTop = anchor ? Math.max(16, anchor.y - 76) : 100;

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        <Pressable
          onPress={open}
          accessibilityRole="button"
          accessibilityHint={message}
          hitSlop={6}
          className="active:opacity-80">
          {children}
        </Pressable>
      </View>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close}>
          {anchor ? (
            <Pressable
              style={[
                styles.bubble,
                {
                  maxWidth: bubbleMaxWidth,
                  top: bubbleTop,
                  right: bubbleRight,
                },
              ]}
              onPress={(event) => event.stopPropagation()}>
              <Text style={styles.message}>{message}</Text>
              {actionLabel && onAction ? (
                <Pressable
                  onPress={handleAction}
                  accessibilityRole="button"
                  className="mt-3 self-start active:opacity-80">
                  <Text style={styles.action}>{actionLabel}</Text>
                </Pressable>
              ) : null}
              <View style={[styles.arrow, { right: 12 }]} pointerEvents="none" />
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: BOTTOM_SHEET_SCRIM,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.foreground,
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  arrow: {
    position: 'absolute',
    bottom: -6,
    width: 12,
    height: 12,
    backgroundColor: colors.card,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    transform: [{ rotate: '45deg' }],
  },
});
