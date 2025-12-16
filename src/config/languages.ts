/**
 * Language configuration for multilingual blog support
 * ISO 639-1 language codes with ISO 3166-1 Alpha-2 country codes where applicable
 */

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGES: Record<string, Language> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr',
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    dir: 'ltr',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    dir: 'ltr',
  },
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    flag: '🇮🇱',
    dir: 'rtl',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dir: 'ltr',
  },
  id: {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    dir: 'ltr',
  },
  vi: {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    dir: 'ltr',
  },
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES);

/**
 * Check if a language code is supported
 */
export function isValidLanguage(lang: string): boolean {
  return SUPPORTED_LANGUAGES.includes(lang);
}

/**
 * Get language info by code, fallback to default
 */
export function getLanguage(code: string): Language {
  return LANGUAGES[code] || LANGUAGES[DEFAULT_LANGUAGE];
}

/**
 * Get URL path for a given language
 * English (default) returns empty string, others return language prefix
 */
export function getLanguagePrefix(lang: string): string {
  return lang === DEFAULT_LANGUAGE ? '' : `/${lang}`;
}

/**
 * Extract language from URL path
 */
export function extractLanguageFromPath(path: string): string {
  const match = path.match(/^\/([a-z]{2})\//);
  if (match && isValidLanguage(match[1])) {
    return match[1];
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Get alternate language URLs for hreflang tags
 */
export function getAlternateLanguageUrls(slug: string, baseUrl: string): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const lang of SUPPORTED_LANGUAGES) {
    const prefix = getLanguagePrefix(lang);
    alternates[lang] = `${baseUrl}${prefix}/blog/${slug}`;
  }

  // Add x-default pointing to English version
  alternates['x-default'] = `${baseUrl}/blog/${slug}`;

  return alternates;
}

/**
 * Get Open Graph locale for a given language code
 * Maps ISO 639-1 codes to full locale codes (e.g., en -> en_US)
 */
export function getOGLocale(lang: string): string {
  const localeMap: Record<string, string> = {
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR',
    de: 'de_DE',
    ja: 'ja_JP',
    ko: 'ko_KR',
    zh: 'zh_CN',
    pt: 'pt_BR',
    he: 'he_IL',
    hi: 'hi_IN',
    id: 'id_ID',
    vi: 'vi_VN',
  };
  return localeMap[lang] || lang;
}
