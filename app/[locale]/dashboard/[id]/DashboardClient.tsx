"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { QRDisplay } from "@/components/QRDisplay";
import { TableQRPreview } from "@/components/TableQRPreview";
import { OwnerMetricsPanel } from "@/components/dashboard/OwnerMetricsPanel";
import { ReservationsList } from "@/components/dashboard/ReservationsList";
import { RestaurantSettingsForm } from "@/components/dashboard/RestaurantSettingsForm";
import {
  PlanBadge,
  ProBadge,
  ProLockedSection,
} from "@/components/dashboard/ProLockedSection";
import {
  RestaurantForm,
  type RestaurantFormValues,
} from "@/components/RestaurantForm";
import { tierAllowsFeature } from "@/lib/tier-enforcement";
import type { RestaurantSettings, RestaurantTier } from "@/lib/types";

interface TableQRItem {
  tableId: string;
  qrDataUrl: string;
  tableUrl: string;
}

type DashboardTab = "metrics" | "configuration" | "qr";

interface DashboardClientProps {
  restaurantId: string;
  tier: RestaurantTier;
  token?: string;
  useSessionAuth?: boolean;
  initialValues: RestaurantFormValues;
  initialSettings: RestaurantSettings;
  publicUrl: string;
  outsidePublicUrl: string;
  qrDataUrl: string;
  outsideQrDataUrl: string;
  tableQRs: TableQRItem[];
}

export function DashboardClient({
  restaurantId,
  tier,
  token,
  initialValues,
  initialSettings,
  publicUrl,
  outsidePublicUrl,
  qrDataUrl,
  outsideQrDataUrl,
  tableQRs,
}: DashboardClientProps) {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tSettings = useTranslations("settings");
  const [tab, setTab] = useState<DashboardTab>("metrics");
  const [success, setSuccess] = useState(false);
  const settingsRef = useRef<RestaurantSettings>(initialSettings);
  const isPro = tier === "pro";

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = async (values: RestaurantFormValues) => {
    const response = await fetch(`/api/restaurants/${restaurantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...values,
        settings: settingsRef.current,
        ...(token ? { token } : {}),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? tErrors("generic"));
    }

    setSuccess(true);
  };

  const tabs: { id: DashboardTab; label: string; locked?: boolean }[] = [
    {
      id: "metrics",
      label: t("tabMetrics"),
      locked: !tierAllowsFeature(tier, "analytics"),
    },
    { id: "configuration", label: t("tabConfiguration") },
    { id: "qr", label: t("tabQr") },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AppHeader backHref="/" backLabel={tCommon("back")} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {initialValues.name}
              </h1>
              <PlanBadge tier={tier} />
            </div>
            <p className="mt-1 text-sm text-muted">{t("title")}</p>
          </div>
          <Link
            href={`/r/${restaurantId}`}
            className="text-sm font-medium text-accent hover:underline"
            target="_blank"
          >
            {t("viewPage")} →
          </Link>
        </div>

        <div className="flex gap-1 rounded-2xl border border-border bg-surface p-1">
          {tabs.map(({ id, label, locked }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
                tab === id
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {label}
              {locked ? <span className="text-xs opacity-70">🔒</span> : null}
            </button>
          ))}
        </div>

        {tab === "metrics" ? (
          <ProLockedSection locked={!isPro} variant="panel">
            <OwnerMetricsPanel
              restaurantId={restaurantId}
              token={token}
              demo={!isPro}
            />
          </ProLockedSection>
        ) : null}

        {tab === "configuration" ? (
          <div className="flex flex-col gap-8">
            <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="mb-1 text-xl font-semibold text-foreground">
                {t("configPageTitle")}
              </h2>
              <p className="mb-6 text-sm text-muted">{t("configPageHint")}</p>
              {success ? (
                <p className="mb-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                  {t("saveSuccess")}
                </p>
              ) : null}
              <RestaurantForm
                initialValues={initialValues}
                tier={tier}
                submitLabel={tCommon("save")}
                onSubmit={handleSubmit}
                settingsSection={
                  <RestaurantSettingsForm
                    settings={initialSettings}
                    tier={tier}
                    onChange={(s) => {
                      settingsRef.current = s;
                    }}
                  />
                }
              />
            </section>

            <ProLockedSection locked={!tierAllowsFeature(tier, "nativeReservations")}>
              <section className="rounded-2xl border border-border bg-surface p-6">
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {t("reservationsTitle")}
                  </h2>
                  {isPro ? <ProBadge /> : null}
                </div>
                <p className="mb-4 text-sm text-muted">
                  {t("reservationsConfigHint")}
                </p>
                <ReservationsList restaurantId={restaurantId} token={token} />
              </section>
            </ProLockedSection>
          </div>
        ) : null}

        {tab === "qr" ? (
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground">
                {t("insideQrTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted">{t("insideQrHint")}</p>
              <div className="mt-4 flex flex-col gap-4">
                <CopyLinkButton url={publicUrl} />
                <Link
                  href={`/r/${restaurantId}`}
                  className="text-sm font-medium text-accent hover:underline"
                  target="_blank"
                >
                  {t("viewPage")} →
                </Link>
                <QRDisplay
                  dataUrl={qrDataUrl}
                  restaurantName={initialValues.name}
                />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">
                {t("outsideQrTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted">{t("outsideQrHint")}</p>
              <div className="mt-4 flex flex-col gap-4">
                <CopyLinkButton url={outsidePublicUrl} />
                <Link
                  href={`/r/${restaurantId}/outside`}
                  className="text-sm font-medium text-accent hover:underline"
                  target="_blank"
                >
                  {t("viewPage")} →
                </Link>
                <QRDisplay
                  dataUrl={outsideQrDataUrl}
                  restaurantName={`${initialValues.name} (outside)`}
                />
              </div>
            </section>

            {initialSettings.customDomain && isPro ? (
              <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
                <span className="font-medium text-foreground">
                  {tSettings("customDomainPreview")}:{" "}
                </span>
                <span className="text-accent">{initialSettings.customDomain}</span>
              </div>
            ) : null}

            <ProLockedSection locked={!tierAllowsFeature(tier, "tableQR")}>
              <section>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {t("tableQrTitle")}
                  </h2>
                  {isPro ? <ProBadge /> : null}
                </div>
                <p className="mt-1 text-sm text-muted">{t("tableQrHint")}</p>
                {tableQRs.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {tableQRs.map((item) => (
                      <TableQRPreview key={item.tableId} {...item} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">
                    {t("tableQrEmptyHint")}
                  </p>
                )}
              </section>
            </ProLockedSection>
          </div>
        ) : null}
      </div>
    </div>
  );
}
