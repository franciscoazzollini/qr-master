"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { parseDemoTier, type DemoTier } from "@/lib/demo/tier";

export function useDemoTier(): DemoTier {
  const searchParams = useSearchParams();
  return parseDemoTier(searchParams.get("tier"));
}

export function DemoTierSwitch() {
  const t = useTranslations("demo.tier");
  const tier = useDemoTier();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const setTier = (next: DemoTier) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tier", next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{t("switchLabel")}</span>
      <div className="flex rounded-xl border border-border bg-surface p-0.5">
        {(["free", "pro"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTier(option)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
              tier === option
                ? option === "pro"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-surface-elevated text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t(option)}
          </button>
        ))}
      </div>
    </div>
  );
}
