/***********************************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 ***********************************************************************************************/

/**
 * Supported language codes for the application.
 * Used for ngx-translate configuration and language detection.
 */
export const SUPPORTED_LANGUAGE_CODES = [
  "en",
  "fr",
  "pl",
  "it",
  "fil",
] as const;

/**
 * Type representing a valid language code.
 */
export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGE_CODES)[number];

/**
 * Default language to use when no match is found.
 */
export const DEFAULT_LANGUAGE: SupportedLanguageCode = "en";

/**
 * Language option interface for UI components.
 */
export interface LanguageOption {
  code: SupportedLanguageCode;
  name: string;
  text: string;
}

/**
 * Language options for settings/admin UI components.
 * Includes both internal name and display text.
 */
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {code: "en", name: "english", text: "English"},
  {code: "fr", name: "french", text: "Français"},
  {code: "pl", name: "polish", text: "Polski"},
  {code: "it", name: "italian", text: "Italiano"},
  {code: "fil", name: "filipino", text: "Filipino"},
];

/**
 * Simplified language options for admin dashboard (without name field).
 */
export const LANGUAGE_OPTIONS_SIMPLE = LANGUAGE_OPTIONS.map(({code, text}) => ({
  code,
  text,
}));

/**
 * localStorage key for storing user's preferred language.
 */
export const LANGUAGE_STORAGE_KEY = "preferredLanguage";

/**
 * Checks if a language code is supported.
 */
export function isSupportedLanguage(
  code: string,
): code is SupportedLanguageCode {
  return SUPPORTED_LANGUAGE_CODES.includes(code as SupportedLanguageCode);
}

/**
 * Extracts the base language code from a locale string (e.g., "en-US" -> "en").
 */
export function extractLanguageCode(locale: string): string {
  return locale.split("-")[0].toLowerCase();
}

/**
 * Detects the best language for the user based on:
 * 1. Saved preference in localStorage
 * 2. Browser/WebView's primary language
 * 3. Any of the browser/device's preferred languages
 * 4. Falls back to default language (English)
 *
 * Works on Web, Android, and iOS platforms.
 */
export function detectUserLanguage(
  browserLang?: string,
): SupportedLanguageCode {
  // 1. Check for saved user preference
  const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLang && isSupportedLanguage(savedLang)) {
    return savedLang;
  }

  // 2. Try browser's primary language (passed from TranslateService)
  if (browserLang && isSupportedLanguage(browserLang)) {
    return browserLang;
  }

  // 3. Check all browser/device languages for any match
  // This handles regional variants like "fil-PH" -> "fil" or "it-IT" -> "it"
  if (typeof navigator !== "undefined") {
    // Check navigator.languages array first (preferred)
    if (navigator.languages?.length) {
      for (const lang of navigator.languages) {
        const langCode = extractLanguageCode(lang);
        if (isSupportedLanguage(langCode)) {
          return langCode;
        }
      }
    }

    // Fallback to navigator.language (single value)
    if (navigator.language) {
      const langCode = extractLanguageCode(navigator.language);
      if (isSupportedLanguage(langCode)) {
        return langCode;
      }
    }
  }

  // 4. Default to English
  return DEFAULT_LANGUAGE;
}

/**
 * Saves the user's language preference to localStorage.
 */
export function saveLanguagePreference(lang: SupportedLanguageCode): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}
