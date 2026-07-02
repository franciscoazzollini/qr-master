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
  RestaurantForm,
  type RestaurantFormValues,
} from "@/components/RestaurantForm";
import type { RestaurantSettings } from "@/lib/types";

interface TableQRItem {
  tableId: string;
  qrDataUrl: string;
  tableUrl: string;
}

type DashboardTab = "metrics" | "setup" | "qr";

interface DashboardClientProps {
  restaurantId: string;
  token: string;
  initialValues: RestaurantFormValues;
  initialSettings: RestaurantSettings;
  publicUrl: string;
  qrDataUrl: string;
  tableQRs: TableQRItem[];
}

export function DashboardClient({
  restaurantId,
  token,
  initialValues,
  initialSettings,
  publicUrl,
  qrDataUrl,
  tableQRs,
}: DashboardClientProps) {
  const t = useTranslations("dashboard");
  const tForm = useTranslations("form");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tSettings = useTranslations("settings");
  const [tab, setTab] = useState<DashboardTab>("metrics");
  const [success, setSuccess] = useState(false);
  const settingsRef = useRef<RestaurantSettings>(initialSettings);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = async (values: RestaurantFormValues) => {
    const response = await fetch(`/api/restaurants/${restaurantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        settings: settingsRef.current,
        token,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? tErrors("generic"));
    }

    setSuccess(true);
  };

  const tabs: { id: DashboardTab; label: string }[] = [
    { id: "metrics", label: t("tabMetrics") },
    { id: "setup", label: t("tabSetup") },
    { id: "qr", label: t("tabQr") },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AppHeader backHref="/" backLabel={tCommon("back")} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {initialValues.name}
            </h1>
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
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === id
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "metrics" ? (
          <div className="flex flex-col gap-8">
            <OwnerMetricsPanel restaurantId={restaurantId} token={token} />
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {t("reservationsTitle")}
              </h2>
              <ReservationsList restaurantId={restaurantId} token={token} />
            </div>
          </div>
        ) : null}

        {tab === "qr" ? (
          <div className="flex flex-col gap-6">
            <CopyLinkButton url={publicUrl} />
            {initialSettings.customDomain ? (
              <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
                <span className="font-medium text-foreground">
                  {tSettings("customDomainPreview")}:{" "}
                </span>
                <span className="text-accent">{initialSettings.customDomain}</span>
              </div>
            ) : null}
            <QRDisplay
              dataUrl={qrDataUrl}
              restaurantName={initialValues.name}
            />
            {tableQRs.length > 0 ? (
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("tableQrTitle")}
                </h2>
                <p className="mt-1 text-sm text-muted">{t("tableQrHint")}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {tableQRs.map((item) => (
                    <TableQRPreview key={item.tableId} {...item} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "setup" ? (
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            {success ? (
              <p className="mb-4 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                {t("saveSuccess")}
              </p>
            ) : null}
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              {tForm("editTitle")}
            </h2>
            <RestaurantForm
              initialValues={initialValues}
              submitLabel={tCommon("save")}
              onSubmit={handleSubmit}
              settingsSection={
                <RestaurantSettingsForm
                  settings={initialSettings}
                  onChange={(s) => {
                    settingsRef.current = s;
                  }}
                />
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
