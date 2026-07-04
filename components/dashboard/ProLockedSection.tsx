"use client";

import { useTranslations } from "next-intl";

type ProLockedVariant = "banner" | "panel";

interface ProLockedSectionProps {
  locked: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: ProLockedVariant;
}

function ProLockedCallout() {
  const t = useTranslations("tier");

  return (
    <div className="max-w-sm rounded-2xl border border-accent/30 bg-surface px-5 py-4 text-center shadow-sm">
      <span className="inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
        {t("planPro")}
      </span>
      <p className="mt-2 text-sm font-semibold text-foreground">
        {t("proLockedTitle")}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {t("proLockedHint")}
      </p>
      <span className="mt-3 inline-block rounded-xl border border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-muted">
        {t("proLockedCta")}
      </span>
    </div>
  );
}

export function ProLockedSection({
  locked,
  children,
  className = "",
  variant = "banner",
}: ProLockedSectionProps) {
  const t = useTranslations("tier");

  if (!locked) {
    return <div className={className}>{children}</div>;
  }

  if (variant === "panel") {
    return (
      <div
        className={`relative min-h-[280px] overflow-hidden rounded-2xl ${className}`}
      >
        <div className="pointer-events-none select-none opacity-40">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/45 p-6 backdrop-blur-[1px]">
          <ProLockedCallout />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-accent/20 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-accent/15 bg-accent/[0.06] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
            {t("planPro")}
          </span>
          <span className="truncate text-xs text-muted">{t("proLockedTitle")}</span>
        </div>
        <span className="shrink-0 text-[11px] font-medium text-muted/80">
          {t("proLockedCta")}
        </span>
      </div>
      <div className="pointer-events-none select-none opacity-45">{children}</div>
    </div>
  );
}

export function ProBadge() {
  const t = useTranslations("tier");

  return (
    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
      {t("planPro")}
    </span>
  );
}

export function PlanBadge({ tier }: { tier: "free" | "pro" }) {
  const t = useTranslations("tier");

  if (tier === "pro") {
    return (
      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
        {t("planPro")}
      </span>
    );
  }

  return (
    <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
      {t("planFree")}
    </span>
  );
}
