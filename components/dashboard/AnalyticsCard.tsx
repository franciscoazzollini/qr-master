"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { ViewCounts } from "@/lib/types";

interface AnalyticsCardProps {
  restaurantId: string;
  token: string;
}

export function AnalyticsCard({ restaurantId, token }: AnalyticsCardProps) {
  const t = useTranslations("analytics");
  const [counts, setCounts] = useState<ViewCounts | null>(null);

  useEffect(() => {
    fetch(
      `/api/restaurants/${restaurantId}/analytics?token=${encodeURIComponent(token)}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.total7d !== undefined) setCounts(data);
      })
      .catch(() => {});
  }, [restaurantId, token]);

  if (!counts) {
    return <p className="text-sm text-muted">{t("loading")}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface-elevated p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{counts.total7d}</p>
          <p className="text-xs text-muted">{t("views7d")}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{counts.total30d}</p>
          <p className="text-xs text-muted">{t("views30d")}</p>
        </div>
      </div>
      {counts.topPaths.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            {t("topPaths")}
          </p>
          <ul className="flex flex-col gap-1">
            {counts.topPaths.map(({ path, count }) => (
              <li
                key={path}
                className="flex justify-between text-sm text-muted"
              >
                <span className="truncate">{path}</span>
                <span className="shrink-0 font-medium text-foreground">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
