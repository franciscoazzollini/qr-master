"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { QRDisplay } from "@/components/QRDisplay";
import { TableQRPreview } from "@/components/TableQRPreview";
import { OwnerMetricsPanel } from "@/components/dashboard/OwnerMetricsPanel";
import { BabForm, type BabFormValues } from "@/components/bab/BabForm";
import { BabSettingsForm } from "@/components/bab/BabSettingsForm";
import { BabDemoTierSwitch, useBabDemoTier } from "@/components/bab/demo/BabDemoTierSwitch";
import { getBabDemoSettingsForTier } from "@/lib/bab/demo/tier";
import type { BabSettings } from "@/lib/types";

interface BabDemoDashboardProps {
  propertyName: string;
  lobbyUrl: string;
  welcomeUrl: string;
  lobbyQrDataUrl: string;
  welcomeQrDataUrl: string;
  roomQRs: { roomId: string; qrDataUrl: string; roomUrl: string }[];
}

export function BabDemoDashboard({
  propertyName,
  lobbyUrl,
  welcomeUrl,
  lobbyQrDataUrl,
  welcomeQrDataUrl,
  roomQRs,
}: BabDemoDashboardProps) {
  const tier = useBabDemoTier();
  const isPro = tier === "pro";
  const t = useTranslations("bab.dashboard");
  const tDemo = useTranslations("bab.demo");
  const tTier = useTranslations("bab.demo.tier");
  const tCommon = useTranslations("common");
  const [tab, setTab] = useState<"metrics" | "configuration" | "qr">("configuration");
  const settings = getBabDemoSettingsForTier(tier);
  const settingsRef = useRef<BabSettings>(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    setTab(isPro ? "metrics" : "configuration");
  }, [isPro]);

  const formValues: BabFormValues = {
    name: propertyName,
    logoUrl: "",
    primaryColor: "#0d9488",
    locale: "en",
    links: {},
    settings,
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <AppHeader backHref="/bab" backLabel={tCommon("back")} homeHref="/bab" />
        <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium">
          {tDemo("banner")}
        </div>
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{propertyName}</h1>
            <p className="text-sm text-muted">
              {isPro ? t("title") : tTier("freeManagerSubtitle")}
            </p>
          </div>
          <BabDemoTierSwitch />
        </div>
        {!isPro ? (
          <p className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted">
            {tTier("managerUpsell")}
          </p>
        ) : null}
        {isPro ? (
          <div className="flex gap-1 rounded-2xl border border-border bg-surface p-1">
            {(
              [
                ["metrics", t("tabMetrics")],
                ["configuration", t("tabConfiguration")],
                ["qr", t("tabQr")],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                  tab === id ? "bg-accent text-accent-foreground" : "text-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
        {isPro && tab === "metrics" ? (
          <OwnerMetricsPanel restaurantId="bab-demo" demo />
        ) : null}
        {(!isPro || tab === "configuration") ? (
          <section className="rounded-2xl border border-border bg-surface p-6">
            <BabForm
              key={tier}
              initialValues={formValues}
              tier={tier}
              submitLabel={tCommon("save")}
              onSubmit={async () => {}}
              settingsSection={
                <BabSettingsForm
                  settings={settings}
                  tier={tier}
                  onChange={(s) => {
                    settingsRef.current = s;
                  }}
                />
              }
            />
          </section>
        ) : null}
        {isPro && tab === "qr" ? (
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="font-semibold">{t("lobbyQrTitle")}</h2>
              <CopyLinkButton url={lobbyUrl} />
              <QRDisplay dataUrl={lobbyQrDataUrl} restaurantName={propertyName} />
            </section>
            <section>
              <h2 className="font-semibold">{t("welcomeQrTitle")}</h2>
              <CopyLinkButton url={welcomeUrl} />
              <QRDisplay dataUrl={welcomeQrDataUrl} restaurantName={`${propertyName} welcome`} />
            </section>
            <div className="grid grid-cols-3 gap-3">
              {roomQRs.map((r) => (
                <TableQRPreview key={r.roomId} {...r} tableId={r.roomId} tableUrl={r.roomUrl} />
              ))}
            </div>
            <Link href="/bab/demo/guest/room/3?tier=pro" className="text-sm text-accent">
              Preview room 3 →
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
