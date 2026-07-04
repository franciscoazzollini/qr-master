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
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        positive
          ? "bg-success/15 text-success"
          : "bg-destructive/15 text-destructive"
      }`}
    >
      {positive ? "↑" : "↓"} {Math.abs(value)}% {t("vsLastWeek")}
    </span>
  );
}

function KpiCard({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string | number;
  hint?: string;
  trend?: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        {trend !== undefined ? <TrendBadge value={trend} /> : null}
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function WeekComparisonChart({
  current,
  previous,
  currentTotal,
  previousTotal,
}: {
  current: RestaurantMetrics["viewsByDay"];
  previous: RestaurantMetrics["prevWeekViewsByDay"];
  currentTotal: number;
  previousTotal: number;
}) {
  const t = useTranslations("metrics");
  const max = Math.max(
    ...current.map((d) => d.count),
    ...previous.map((d) => d.count),
    1,
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">
          {t("weekComparisonTitle")}
        </p>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-accent" />
            {t("thisWeek")}: <strong>{currentTotal}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-muted/50" />
            {t("lastWeek")}: <strong>{previousTotal}</strong>
          </span>
        </div>
      </div>
      <div className="flex h-36 items-end justify-between gap-1">
        {current.map((day, i) => {
          const prev = previous[i]?.count ?? 0;
          const curH = Math.max(6, (day.count / max) * 100);
          const prevH = Math.max(6, (prev / max) * 100);
          const label = new Date(day.date + "T12:00:00").toLocaleDateString(
            undefined,
            { weekday: "short" },
          );
          return (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div className="flex h-28 w-full items-end justify-center gap-0.5">
                <div
                  className="w-[42%] rounded-t bg-muted/40"
                  style={{ height: `${prevH}%` }}
                  title={`${t("lastWeek")}: ${prev}`}
                />
                <div
                  className="w-[42%] rounded-t bg-accent"
                  style={{ height: `${curH}%` }}
                  title={`${t("thisWeek")}: ${day.count}`}
                />
              </div>
              <span className="text-[10px] text-muted">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConversionFunnel({
  funnel,
  scans,
}: {
  funnel: RestaurantMetrics["funnel"];
  scans: number;
}) {
  const t = useTranslations("metrics");
  const steps = [
    {
      key: "outside",
      label: t("funnelOutside"),
      value: funnel.outsideScans,
      color: "#0ea5e9",
    },
    { key: "scans", label: t("funnelScan"), value: funnel.scans, color: "#2563eb" },
    {
      key: "menu",
      label: t("funnelMenu"),
      value: funnel.menuViews,
      color: "#7c3aed",
    },
    {
      key: "reserve",
      label: t("funnelReserve"),
      value: funnel.reservations,
      color: "#e07a3a",
    },
    {
      key: "pay",
      label: t("funnelPay"),
      value: funnel.payments,
      color: "#16a34a",
    },
  ];

  const base = funnel.outsideScans || funnel.scans || 1;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <p className="mb-1 text-sm font-semibold text-foreground">
        {t("funnelTitle")}
      </p>
      <p className="mb-4 text-xs text-muted">{t("funnelSubtitle")}</p>
      <div className="flex flex-col gap-3">
        {steps.map((step, index) => {
          const width = Math.max(28, Math.round((step.value / base) * 100));
          const prev = index > 0 ? steps[index - 1].value : base;
          const stepRate =
            prev > 0 ? Math.round((step.value / prev) * 100) : 0;
          return (
            <div key={step.key}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-foreground">{step.label}</span>
                <span className="text-muted">
                  {step.value}
                  {index > 0 ? (
                    <span className="ml-1 text-foreground">({stepRate}%)</span>
                  ) : null}
                </span>
              </div>
              <div className="h-9 overflow-hidden rounded-xl bg-surface-elevated">
                <div
                  className="flex h-full items-center rounded-xl px-3 text-xs font-semibold text-white transition-all"
                  style={{
                    width: `${width}%`,
                    backgroundColor: step.color,
                    minWidth: "4.5rem",
                  }}
                >
                  {index > 0 && stepRate > 0 ? `${stepRate}%` : ""}
                </div>
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

  const payRate =
    metrics.funnel.scans > 0
      ? Math.round((metrics.funnel.payments / metrics.funnel.scans) * 1000) / 10
      : 0;

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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">{t("heroLabel")}</p>
            <div className="mt-1 flex items-baseline gap-3">
              <p className="text-4xl font-bold tabular-nums text-foreground">
                {metrics.views7d}
              </p>
              <p className="text-sm text-muted">
                {t("vs")}{" "}
                <span className="font-semibold text-foreground">
                  {metrics.viewsPrev7d}
                </span>{" "}
                {t("lastWeekShort")}
              </p>
            </div>
          </div>
          <TrendBadge value={metrics.viewsTrend} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label={t("avgTicket")}
          value={`€${metrics.avgTicket.toFixed(2)}`}
          hint={t("avgTicketHint")}
          trend={metrics.avgTicketTrend}
        />
        <KpiCard
          label={t("reservations")}
          value={metrics.reservations7d}
          hint={`${metrics.reservationsPending} ${t("pending")}`}
          trend={metrics.reservationsTrend}
        />
        <KpiCard
          label={t("covers")}
          value={metrics.covers7d}
          hint={t("coversHint")}
          trend={metrics.coversTrend}
        />
        <KpiCard
          label={t("payRate")}
          value={`${payRate}%`}
          hint={`${metrics.payments7d} ${t("paymentsHint")}`}
          trend={metrics.paymentsTrend}
        />
      </div>

      <WeekComparisonChart
        current={metrics.viewsByDay}
        previous={metrics.prevWeekViewsByDay}
        currentTotal={metrics.views7d}
        previousTotal={metrics.viewsPrev7d}
      />

      <ConversionFunnel funnel={metrics.funnel} scans={metrics.funnel.scans} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label={t("today")} value={metrics.viewsToday} />
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
        <KpiCard
          label={t("month")}
          value={metrics.views30d}
          hint={t("monthHint")}
        />
      </div>
    </div>
  );
}
