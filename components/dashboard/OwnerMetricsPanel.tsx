"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DEMO_METRICS } from "@/lib/demo/metrics";
import type { RestaurantMetrics } from "@/lib/types";

interface OwnerMetricsPanelProps {
  restaurantId: string;
  token: string;
  demo?: boolean;
}

function TrendBadge({ value }: { value: number }) {
  const t = useTranslations("metrics");
  if (value === 0) {
    return <span className="text-xs text-muted">{t("noChange")}</span>;
  }
  const positive = value > 0;
  return (
    <span
      className={`text-xs font-semibold ${positive ? "text-success" : "text-destructive"}`}
    >
      {positive ? "↑" : "↓"} {Math.abs(value)}% {t("vsLastWeek")}
    </span>
  );
}

function KpiCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p
        className="mt-1 text-3xl font-bold tabular-nums text-foreground"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function BarChart({ data }: { data: RestaurantMetrics["viewsByDay"] }) {
  const t = useTranslations("metrics");
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-foreground">
        {t("chartTitle")}
      </p>
      <div className="flex h-32 items-end justify-between gap-1.5">
        {data.map((day) => {
          const height = Math.max(8, (day.count / max) * 100);
          const label = new Date(day.date + "T12:00:00").toLocaleDateString(
            undefined,
            { weekday: "short" },
          );
          return (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="text-[10px] font-medium text-muted">
                {day.count}
              </span>
              <div
                className="w-full rounded-t-md bg-accent/80 transition-all"
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-muted">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionBreakdown({
  actions,
  total,
}: {
  actions: RestaurantMetrics["actions"];
  total: number;
}) {
  const t = useTranslations("metrics");
  const items = [
    { key: "landing" as const, label: t("actionLanding") },
    { key: "menu" as const, label: t("actionMenu") },
    { key: "reserve" as const, label: t("actionReserve") },
    { key: "table" as const, label: t("actionTable") },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <p className="mb-4 text-sm font-semibold text-foreground">
        {t("actionsTitle")}
      </p>
      <div className="flex flex-col gap-3">
        {items.map(({ key, label }) => {
          const count = actions[key];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={key}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-foreground">{label}</span>
                <span className="font-medium text-foreground">
                  {count}{" "}
                  <span className="text-muted">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OwnerMetricsPanel({
  restaurantId,
  token,
  demo = false,
}: OwnerMetricsPanelProps) {
  const t = useTranslations("metrics");
  const [metrics, setMetrics] = useState<RestaurantMetrics | null>(
    demo ? DEMO_METRICS : null,
  );

  useEffect(() => {
    if (demo) return;
    fetch(
      `/api/restaurants/${restaurantId}/analytics?token=${encodeURIComponent(token)}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.views7d !== undefined) setMetrics(data);
      })
      .catch(() => {});
  }, [restaurantId, token, demo]);

  if (!metrics) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
        {t("loading")}
      </div>
    );
  }

  const actionTotal =
    metrics.actions.landing +
    metrics.actions.menu +
    metrics.actions.reserve +
    metrics.actions.table;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
          <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
        </div>
        {demo ? (
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
            {t("demoBadge")}
          </span>
        ) : null}
      </div>

      <div className="rounded-2xl border border-accent/25 bg-accent/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted">{t("heroLabel")}</p>
            <p className="text-4xl font-bold tabular-nums text-foreground">
              {metrics.views7d}
            </p>
          </div>
          <TrendBadge value={metrics.viewsTrend} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label={t("today")} value={metrics.viewsToday} />
        <KpiCard
          label={t("reservations")}
          value={metrics.reservations7d}
          hint={`${metrics.reservationsPending} ${t("pending")}`}
        />
        <KpiCard label={t("covers")} value={metrics.covers7d} hint={t("coversHint")} />
        <KpiCard
          label={t("upcoming")}
          value={metrics.upcomingReservations}
          hint={t("upcomingHint")}
        />
        <KpiCard
          label={t("conversion")}
          value={`${metrics.conversionRate}%`}
          hint={t("conversionHint")}
        />
        <KpiCard label={t("month")} value={metrics.views30d} hint={t("monthHint")} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart data={metrics.viewsByDay} />
        <ActionBreakdown actions={metrics.actions} total={actionTotal} />
      </div>

      {metrics.topPaths.length > 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-foreground">
            {t("topPages")}
          </p>
          <ul className="flex flex-col gap-2">
            {metrics.topPaths.map(({ path, count }) => (
              <li
                key={path}
                className="flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2 text-sm"
              >
                <span className="truncate text-muted">{path || "/"}</span>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">
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
