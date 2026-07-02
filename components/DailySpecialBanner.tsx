import type { DailySpecial } from "@/lib/types";

interface DailySpecialBannerProps {
  special: DailySpecial;
  primaryColor: string;
  proLabel?: string;
}

export function DailySpecialBanner({
  special,
  primaryColor,
  proLabel,
}: DailySpecialBannerProps) {
  if (!special.active) return null;

  return (
    <div
      className="rounded-2xl border px-4 py-4 shadow-sm"
      style={{
        borderColor: `${primaryColor}40`,
        backgroundColor: `${primaryColor}10`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: primaryColor }}
        >
          {proLabel ?? "Today's special"}
        </p>
        {special.price ? (
          <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-sm font-bold text-foreground">
            {special.price}
          </span>
        ) : null}
      </div>
      <h2 className="mt-1 text-lg font-bold text-foreground">{special.title}</h2>
      {special.description ? (
        <p className="mt-1 text-sm text-muted">{special.description}</p>
      ) : null}
    </div>
  );
}
