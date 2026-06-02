/** Default deck for mock lessons (public Google sample — must be link-shared for embed). */
export const MOCK_GOOGLE_SLIDES_URL =
  'https://docs.google.com/presentation/d/1Evd0PgabxE5dynU2D943Hw8UZD4RHnPgyNTvObJC7o/edit?usp=sharing';

const PRESENTATION_ID_PATTERN =
  /\/presentation\/d\/([a-zA-Z0-9_-]+)/;

const PUBLISHED_ID_PATTERN =
  /\/presentation\/d\/e\/([a-zA-Z0-9_-]+)/;

export type GoogleSlidesParseResult =
  | { ok: true; presentationId: string }
  | { ok: false; error: string };

/**
 * Extracts a Google Slides presentation ID from common share / edit URLs.
 */
export function parseGoogleSlidesUrl(url: string): GoogleSlidesParseResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return { ok: false, error: 'Paste your Google Slides link to continue.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: 'Enter a valid URL.' };
  }

  if (!parsed.hostname.includes('docs.google.com')) {
    return { ok: false, error: 'Only Google Slides links are supported (docs.google.com).' };
  }

  if (!parsed.pathname.includes('/presentation/')) {
    return { ok: false, error: 'Link must be a Google Slides presentation.' };
  }

  const publishedMatch = parsed.pathname.match(PUBLISHED_ID_PATTERN);
  if (publishedMatch?.[1]) {
    return { ok: true, presentationId: publishedMatch[1] };
  }

  const fileMatch = parsed.pathname.match(PRESENTATION_ID_PATTERN);
  if (fileMatch?.[1]) {
    return { ok: true, presentationId: fileMatch[1] };
  }

  return { ok: false, error: 'Could not read the presentation ID from this link.' };
}

/**
 * Embed URL for in-app WebView preview (publish-to-web / embed mode).
 * @see https://support.google.com/docs/answer/183965
 */
export function getGoogleSlidesEmbedUrl(shareUrl: string): string | null {
  const parsed = parseGoogleSlidesUrl(shareUrl);
  if (!parsed.ok) return null;

  const params = new URLSearchParams({
    start: 'false',
    loop: 'false',
    delayms: '3000',
  });

  if (shareUrl.includes('/d/e/')) {
    return `https://docs.google.com/presentation/d/e/${parsed.presentationId}/embed?${params.toString()}`;
  }

  return `https://docs.google.com/presentation/d/${parsed.presentationId}/embed?${params.toString()}`;
}

export function isValidGoogleSlidesUrl(url: string): boolean {
  return parseGoogleSlidesUrl(url).ok;
}
