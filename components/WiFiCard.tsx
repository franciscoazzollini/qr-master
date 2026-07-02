"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { RestaurantWifi } from "@/lib/types";

interface WiFiCardProps {
  wifi: RestaurantWifi;
  primaryColor: string;
}

export function WiFiCard({ wifi, primaryColor }: WiFiCardProps) {
  const t = useTranslations("wifi");
  const [copied, setCopied] = useState<"ssid" | "password" | null>(null);

  const copy = async (field: "ssid" | "password", value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: `${primaryColor}18` }}
        >
          📶
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{t("title")}</p>
          <p className="text-xs text-muted">{t("subtitle")}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2">
          <div>
            <p className="text-xs text-muted">{t("network")}</p>
            <p className="font-medium text-foreground">{wifi.ssid}</p>
          </div>
          <button
            type="button"
            onClick={() => copy("ssid", wifi.ssid)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10"
          >
            {copied === "ssid" ? t("copied") : t("copy")}
          </button>
        </div>
        {wifi.password ? (
          <div className="flex items-center justify-between rounded-xl bg-surface-elevated px-3 py-2">
            <div>
              <p className="text-xs text-muted">{t("password")}</p>
              <p className="font-medium text-foreground">{wifi.password}</p>
            </div>
            <button
              type="button"
              onClick={() => copy("password", wifi.password)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10"
            >
              {copied === "password" ? t("copied") : t("copy")}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
