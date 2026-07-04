"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { BabSettings, DayOfWeek, RestaurantTier } from "@/lib/types";
import { tierAllowsFeature } from "@/lib/tier-enforcement";
import { ProBadge, ProLockedSection } from "@/components/dashboard/ProLockedSection";

const DAYS: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const inputClass =
  "rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent";

interface BabSettingsFormProps {
  settings: BabSettings;
  tier: RestaurantTier;
  onChange: (settings: BabSettings) => void;
}

export function BabSettingsForm({ settings: initial, tier, onChange }: BabSettingsFormProps) {
  const t = useTranslations("bab.settings");
  const tSettings = useTranslations("settings");
  const [settings, setSettings] = useState<BabSettings>(initial);
  const isPro = tier === "pro";

  const update = (partial: Partial<BabSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    onChange(next);
  };

  const updateWifi = (field: "ssid" | "password", value: string) => {
    update({
      wifi: {
        ssid: field === "ssid" ? value : settings.wifi?.ssid ?? "",
        password: field === "password" ? value : settings.wifi?.password ?? "",
      },
    });
  };

  const updateHours = (
    which: "receptionHours" | "breakfastHours",
    day: DayOfWeek,
    field: "open" | "close" | "closed",
    value: string,
  ) => {
    const current = { ...(settings[which] ?? {}) };
    if (field === "closed") {
      current[day] = value === "true" ? null : { open: "08:00", close: "22:00" };
    } else {
      const existing = current[day] ?? { open: "08:00", close: "22:00" };
      current[day] = { ...existing, [field]: value };
    }
    update({ [which]: current });
  };

  const renderHours = (which: "receptionHours" | "breakfastHours", title: string) => (
    <section>
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-2">
        {DAYS.map((day) => {
          const hours = settings[which]?.[day];
          const closed = hours === null;
          return (
            <div
              key={day}
              className="grid grid-cols-[4rem_1fr_1fr_auto] items-center gap-2 text-sm"
            >
              <span className="font-medium capitalize">{tSettings(`days.${day}`)}</span>
              <input
                type="time"
                disabled={closed}
                value={hours?.open ?? "08:00"}
                onChange={(e) => updateHours(which, day, "open", e.target.value)}
                className={inputClass}
              />
              <input
                type="time"
                disabled={closed}
                value={hours?.close ?? "22:00"}
                onChange={(e) => updateHours(which, day, "close", e.target.value)}
                className={inputClass}
              />
              <label className="flex items-center gap-1 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={closed}
                  onChange={(e) =>
                    updateHours(which, day, "closed", String(e.target.checked))
                  }
                />
                {tSettings("closed")}
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-lg font-semibold text-foreground">{t("wifiTitle")}</h3>
        <p className="mb-4 text-sm text-muted">{t("wifiHint")}</p>
        <div className="grid gap-3">
          <input
            value={settings.wifi?.ssid ?? ""}
            onChange={(e) => updateWifi("ssid", e.target.value)}
            placeholder="SSID"
            className={inputClass}
          />
          <input
            value={settings.wifi?.password ?? ""}
            onChange={(e) => updateWifi("password", e.target.value)}
            placeholder="Password"
            className={inputClass}
          />
        </div>
      </section>

      {renderHours("receptionHours", t("receptionHoursTitle"))}
      {renderHours("breakfastHours", t("breakfastHoursTitle"))}

      <section>
        <h3 className="mb-4 text-lg font-semibold text-foreground">{t("checkInOutTitle")}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            {t("checkIn")}
            <input
              type="time"
              value={settings.checkInOut?.checkIn ?? "15:00"}
              onChange={(e) =>
                update({
                  checkInOut: {
                    checkIn: e.target.value,
                    checkOut: settings.checkInOut?.checkOut ?? "11:00",
                  },
                })
              }
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            {t("checkOut")}
            <input
              type="time"
              value={settings.checkInOut?.checkOut ?? "11:00"}
              onChange={(e) =>
                update({
                  checkInOut: {
                    checkIn: settings.checkInOut?.checkIn ?? "15:00",
                    checkOut: e.target.value,
                  },
                })
              }
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <ProLockedSection locked={!tierAllowsFeature(tier, "tableOrdering")}>
        <section>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{t("receptionWhatsApp")}</h3>
            {isPro ? <ProBadge /> : null}
          </div>
          <p className="mb-3 text-sm text-muted">{t("receptionHint")}</p>
          <input
            value={settings.receptionWhatsApp ?? ""}
            onChange={(e) => update({ receptionWhatsApp: e.target.value })}
            placeholder="+34 600 000 000"
            className={inputClass}
            disabled={!isPro}
          />
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-medium">{t("roomCount")}</span>
            <input
              type="number"
              min={0}
              max={50}
              value={settings.roomCount ?? 0}
              onChange={(e) => update({ roomCount: Number(e.target.value) || 0 })}
              className={inputClass}
              disabled={!isPro}
            />
          </label>
        </section>
      </ProLockedSection>

      <ProLockedSection locked={!isPro}>
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{t("houseRulesTitle")}</h3>
            {isPro ? <ProBadge /> : null}
          </div>
          <p className="mb-3 text-sm text-muted">{t("houseRulesHint")}</p>
          <textarea
            rows={4}
            value={settings.houseRules?.rules?.join("\n") ?? ""}
            onChange={(e) =>
              update({
                houseRules: {
                  title: settings.houseRules?.title,
                  rules: e.target.value.split("\n").filter(Boolean),
                },
              })
            }
            className={inputClass}
            disabled={!isPro}
            placeholder="One rule per line"
          />
        </section>
      </ProLockedSection>

      <ProLockedSection locked={!tierAllowsFeature(tier, "nativeReservations")}>
        <section>
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{t("reservationsTitle")}</h3>
            {isPro ? <ProBadge /> : null}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.reservationsEnabled ?? false}
              onChange={(e) => update({ reservationsEnabled: e.target.checked })}
              disabled={!isPro}
            />
            <span className="text-sm">{t("reservationsEnabled")}</span>
          </label>
        </section>
      </ProLockedSection>
    </div>
  );
}
