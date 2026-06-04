import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/theme';
import { getGoogleSlidesEmbedUrl } from '@/lib/googleSlides';
import { getNativeWebView } from '@/lib/nativeWebView';

interface GoogleSlidesEmbedProps {
  shareUrl: string;
  className?: string;
  /** When embedded in a parent ScrollView, disable WebView scrolling so the page scrolls. */
  nestedInScrollView?: boolean;
}

function WebViewUnavailableFallback({
  embedUrl,
  className,
}: {
  embedUrl: string;
  className?: string;
}) {
  const openInBrowser = () => {
    void WebBrowser.openBrowserAsync(embedUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
  };

  return (
    <View
      className={`items-center justify-center gap-4 bg-muted px-6 ${className ?? ''}`}
      style={{ minHeight: 200 }}>
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
        <Feather name="layout" size={24} color={colors.primary} />
      </View>
      <Text className="text-center text-sm leading-5 text-muted-foreground">
        In-app slide preview needs a fresh native build. Rebuild the iOS app, then slides will embed
        here.
      </Text>
      <Button title="Open slides in browser" variant="outline" onPress={openInBrowser} />
    </View>
  );
}

export function GoogleSlidesEmbed({
  shareUrl,
  className,
  nestedInScrollView = false,
}: GoogleSlidesEmbedProps) {
  const embedUrl = getGoogleSlidesEmbedUrl(shareUrl);
  const WebView = getNativeWebView();

  if (!embedUrl) {
    return (
      <View
        className={`items-center justify-center bg-muted px-4 ${className ?? ''}`}
        style={{ minHeight: 200 }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!WebView) {
    return <WebViewUnavailableFallback embedUrl={embedUrl} className={className} />;
  }

  return (
    <View className={`overflow-hidden bg-black ${className ?? ''}`} style={{ minHeight: 200 }}>
      <WebView
        source={{ uri: embedUrl }}
        style={{ flex: 1, backgroundColor: '#000' }}
        scrollEnabled={!nestedInScrollView}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View className="flex-1 items-center justify-center bg-muted">
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
      />
    </View>
  );
}
