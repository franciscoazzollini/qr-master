"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  copyPasswordAndOpenSettings,
  copyWifiPassword,
  detectWifiPlatform,
} from "@/lib/wifi-connect";
import type { RestaurantWifi } from "@/lib/types";

interface WiFiConnectButtonProps {
  wifi: RestaurantWifi;
  primaryColor: string;
}

export function WiFiConnectButton({
  wifi,
  primaryColor,
}: WiFiConnectButtonProps) {
  const t = useTranslations("wifi");
  const [open, setOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<"ssid" | "password" | null>(
    null,
  );
  const [connectStatus, setConnectStatus] = useState<
    "idle" | "copied" | "opened" | "failed"
  >("idle");

  const platform = detectWifiPlatform();

  const copy = async (field: "ssid" | "password", value: string) => {
    const ok = await copyWifiPassword(value);
    if (ok) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleConnect = async () => {
    if (!wifi.password) {
      await copy("ssid", wifi.ssid);
      setConnectStatus("copied");
      return;
    }

    const result = await copyPasswordAndOpenSettings(wifi.password, platform);
    setConnectStatus(
      result === "opened" ? "opened" : result === "copied" ? "copied" : "failed",
    );
    setTimeout(() => setConnectStatus("idle"), 3000);
  };

  const buttonClass =
    "flex min-h-[3.75rem] w-full items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3 text-left shadow-sm transition-all active:scale-[0.99] hover:shadow-md";

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={buttonClass}
        aria-expanded={open}
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}
          aria-hidden
        >
          📶
        </span>
        <span
          className="min-w-0 flex-1 text-base font-semibold text-foreground"
          style={{
            borderLeft: `3px solid ${primaryColor}`,
            paddingLeft: "0.75rem",
          }}
        >
          {t("connectButton")}
        </span>
        <span className="shrink-0 text-muted" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
      </button>

      {open ? (
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-sm text-muted">
            {platform === "ios"
              ? t("iosHint", { ssid: wifi.ssid })
              : platform === "android"
                ? t("androidHint")
                : t("desktopHint")}
          </p>

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
                {copiedField === "ssid" ? t("copied") : t("copy")}
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
                  {copiedField === "password" ? t("copied") : t("copy")}
                </button>
              </div>
            ) : null}
          </div>

          {wifi.password ? (
            <button
              type="button"
              onClick={handleConnect}
              className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {connectStatus === "opened"
                ? t("openedSettings")
                : connectStatus === "copied"
                  ? t("copiedPassword")
                  : connectStatus === "failed"
                    ? t("copyFailed")
                    : platform === "android"
                      ? t("copyPasswordOpen")
                      : t("copyPassword")}
            </button>
          ) : null}

          <p className="mt-3 text-xs text-muted">{t("noAutoConnect")}</p>
        </div>
      ) : null}
    </div>
  );
}
