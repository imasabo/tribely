import { NativeModules } from 'react-native';

/** True when the dev client / binary was built with react-native-webview linked. */
export function isNativeWebViewAvailable(): boolean {
  return (
    NativeModules.RNCWebViewModule != null ||
    // Older RN WebView module name
    (NativeModules as Record<string, unknown>).RNCWebView != null
  );
}

export type NativeWebViewComponent = React.ComponentType<
  import('react-native-webview').WebViewProps
>;

export function getNativeWebView(): NativeWebViewComponent | null {
  if (!isNativeWebViewAvailable()) return null;
  // Avoid loading the package when the native module is missing (crashes on render).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('react-native-webview').WebView;
}
