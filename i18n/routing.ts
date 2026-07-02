import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = [
  "en",
  "es",
  "th",
  "zh",
  "ja",
  "id",
  "ms",
  "hi",
  "ar",
  "ko",
] as const;

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  th: "ไทย",
  zh: "中文",
  ja: "日本語",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu",
  hi: "हिन्दी",
  ar: "العربية",
  ko: "한국어",
};

export function isRtlLocale(locale: string): boolean {
  return locale === "ar";
}
