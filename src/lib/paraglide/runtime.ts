// Define available languages
export const sourceLanguageTag = 'en';
export const availableLanguageTags = ['en', 'ar'] as const;

// Language tag type
export type LanguageTag = typeof availableLanguageTags[number];

// Required functions for Paraglide
export function setLanguageTag(tag: LanguageTag) {
  // Implementation for setting language
}

export function isAvailableLanguageTag(tag: string): tag is LanguageTag {
  return availableLanguageTags.includes(tag as LanguageTag);
}

// Messages
export const messages = {
  hello: {
    en: 'Hello',
    ar: 'مرحبا'
  }
} as const; 