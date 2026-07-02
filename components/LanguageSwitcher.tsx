"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { localeLabels, locales, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className={`flex items-center gap-2 text-sm ${className}`}>
      <span className="text-muted" aria-hidden>
        🌐
      </span>
      <select
        value={locale}
        onChange={(event) => {
          router.replace(pathname, { locale: event.target.value as Locale });
        }}
        className="rounded-xl border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
        aria-label="Language"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {localeLabels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
