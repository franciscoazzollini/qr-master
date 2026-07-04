"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { QRDisplay } from "@/components/QRDisplay";
import { TableQRPreview } from "@/components/TableQRPreview";
import { OwnerMetricsPanel } from "@/components/dashboard/OwnerMetricsPanel";
import { RestaurantSettingsForm } from "@/components/dashboard/RestaurantSettingsForm";
import {
  RestaurantForm,
  type RestaurantFormValues,
} from "@/components/RestaurantForm";
import { DemoTierSwitch, useDemoTier } from "@/components/demo/DemoTierSwitch";
import { getDemoSettingsForTier } from "@/lib/demo/tier";
import type { RestaurantSettings } from "@/lib/types";

interface TableQRItem {
  tableId: string;
  qrDataUrl: string;
  tableUrl: string;
}

type DashboardTab = "metrics" | "configuration" | "qr";

interface DemoDashboardProps {
  initialValues: RestaurantFormValues;
  publicUrl: string;
  qrDataUrl: string;
  outsidePublicUrl: string;
  outsideQrDataUrl: string;
  tableQRs: TableQRItem[];
}

export function DemoDashboard({
  initialValues,
  publicUrl,
  qrDataUrl,
  outsidePublicUrl,
  outsideQrDataUrl,
  tableQRs,
}: DemoDashboardProps) {
  const tier = useDemoTier();
  const isPro = tier === "pro";
  const t = useTranslations("dashboard");
  const tDemo = useTranslations("demo.dashboard");
  const tTier = useTranslations("demo.tier");
  const tCommon = useTranslations("common");
  const tSettings = useTranslations("settings");
  const [tab, setTab] = useState<DashboardTab>("metrics");
  const [demoNotice, setDemoNotice] = useState(false);
  const settings = getDemoSettingsForTier(tier);
  const settingsRef = useRef<RestaurantSettings>(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    setTab(isPro ? "metrics" : "configuration");
  }, [isPro]);

  const guestDemoHref = `/r/demo?tier=${tier}`;

  const handleSubmit = async () => {
    setDemoNotice(true);
    setTimeout(() => setDemoNotice(false), 3000);
  };

  const formValues: RestaurantFormValues = {
    ...initialValues,
    settings,
  };

  const tabs: { id: DashboardTab; label: string }[] = [
    { id: "metrics", label: t("tabMetrics") },
    { id: "configuration", label: t("tabConfiguration") },
    { id: "qr", label: t("tabQr") },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AppHeader backHref="/guide" backLabel={tCommon("back")} />

        <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-foreground">
          {tDemo("banner")}
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{tDemo("title")}</h1>
            <p className="mt-1 text-sm text-muted">
              {isPro ? tDemo("metricsSubtitle") : tTier("freeManagerSubtitle")}
            </p>
          </div>
          <DemoTierSwitch />
        </div>

        {!isPro ? (
          <div className="rounded-2xl border border-border bg-surface px-4 py-4 text-sm text-muted">
            <p>{tTier("managerUpsell")}</p>
          </div>
        ) : null}

        {isPro ? (
          <div className="flex gap-1 rounded-2xl border border-border bg-surface p-1">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
                  tab === id
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}

        {isPro && tab === "metrics" ? (
          <OwnerMetricsPanel restaurantId="demo" token="demo" demo />
        ) : null}

        {(!isPro || tab === "configuration") ? (
          <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="mb-1 text-xl font-semibold text-foreground">
              {t("configPageTitle")}
            </h2>
            <p className="mb-6 text-sm text-muted">{t("configPageHint")}</p>
            <RestaurantForm
              key={tier}
              initialValues={formValues}
              tier={tier}
              submitLabel={tCommon("save")}
              onSubmit={handleSubmit}
              settingsSection={
                <RestaurantSettingsForm
                  settings={settings}
                  tier={tier}
                  onChange={(s) => {
                    settingsRef.current = s;
                  }}
                />
              }
            />
            {demoNotice ? (
              <p className="mt-4 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
                {tDemo("saveDisabled")}
              </p>
            ) : null}
          </section>
        ) : null}

        {isPro && tab === "qr" ? (
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground">
                {t("insideQrTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted">{t("insideQrHint")}</p>
              <div className="mt-4 flex flex-col gap-4">
                <CopyLinkButton url={publicUrl} />
                <Link
                  href={guestDemoHref}
                  className="text-sm font-medium text-accent hover:underline"
                  target="_blank"
                >
                  {t("viewPage")} →
                </Link>
                <QRDisplay dataUrl={qrDataUrl} restaurantName={initialValues.name} />
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
                  href="/r/demo/outside"
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

            {settings.customDomain ? (
              <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
                <span className="font-medium text-foreground">
                  {tSettings("customDomainPreview")}:{" "}
                </span>
                <span className="text-accent">{settings.customDomain}</span>
              </div>
            ) : null}

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {tDemo("tableQrTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted">{tDemo("tableQrHint")}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tableQRs.map((item) => (
                  <TableQRPreview key={item.tableId} {...item} />
                ))}
              </div>
              <Link
                href="/r/demo/table/12?tier=pro"
                className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
              >
                Try table 12 demo →
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
