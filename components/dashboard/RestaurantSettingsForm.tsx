"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { DayOfWeek, RestaurantSettings } from "@/lib/types";
import { buildHostedMenuTemplate } from "@/lib/menu/hosted-menu";

const DAYS: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const inputClass =
  "rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent";

interface RestaurantSettingsFormProps {
  settings: RestaurantSettings;
  onChange: (settings: RestaurantSettings) => void;
}

export function RestaurantSettingsForm({
  settings: initialSettings,
  onChange,
}: RestaurantSettingsFormProps) {
  const t = useTranslations("settings");
  const [settings, setSettings] = useState<RestaurantSettings>(initialSettings);

  const update = (partial: Partial<RestaurantSettings>) => {
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

  const updateDailySpecial = (
    field: keyof NonNullable<RestaurantSettings["dailySpecial"]>,
    value: string | boolean,
  ) => {
    update({
      dailySpecial: {
        title: settings.dailySpecial?.title ?? "",
        description: settings.dailySpecial?.description ?? "",
        price: settings.dailySpecial?.price,
        active: settings.dailySpecial?.active ?? false,
        [field]: value,
      },
    });
  };

  const updateHours = (
    day: DayOfWeek,
    field: "open" | "close" | "closed",
    value: string,
  ) => {
    const current = { ...settings.openingHours };
    if (field === "closed") {
      current[day] = value === "true" ? null : { open: "12:00", close: "22:00" };
    } else {
      const existing = current[day] ?? { open: "12:00", close: "22:00" };
      current[day] = { ...existing, [field]: value };
    }
    update({ openingHours: current });
  };

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-lg font-semibold text-foreground">{t("wifiTitle")}</h3>
        <p className="mb-4 text-sm text-muted">{t("wifiHint")}</p>
        <div className="grid gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("wifiSsid")}</span>
            <input
              value={settings.wifi?.ssid ?? ""}
              onChange={(e) => updateWifi("ssid", e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("wifiPassword")}</span>
            <input
              value={settings.wifi?.password ?? ""}
              onChange={(e) => updateWifi("password", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground">
          {t("hoursTitle")}
        </h3>
        <div className="mt-4 flex flex-col gap-2">
          {DAYS.map((day) => {
            const hours = settings.openingHours?.[day];
            const closed = hours === null;
            return (
              <div
                key={day}
                className="grid grid-cols-[4rem_1fr_1fr_auto] items-center gap-2 text-sm"
              >
                <span className="font-medium capitalize">{t(`days.${day}`)}</span>
                <input
                  type="time"
                  disabled={closed}
                  value={hours?.open ?? "12:00"}
                  onChange={(e) => updateHours(day, "open", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="time"
                  disabled={closed}
                  value={hours?.close ?? "22:00"}
                  onChange={(e) => updateHours(day, "close", e.target.value)}
                  className={inputClass}
                />
                <label className="flex items-center gap-1 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={closed}
                    onChange={(e) =>
                      updateHours(day, "closed", String(e.target.checked))
                    }
                  />
                  {t("closed")}
                </label>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            {t("dailySpecialTitle")}
          </h3>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
            Pro
          </span>
        </div>
        <div className="grid gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.dailySpecial?.active ?? false}
              onChange={(e) => updateDailySpecial("active", e.target.checked)}
            />
            <span className="text-sm">{t("dailySpecialActive")}</span>
          </label>
          <input
            value={settings.dailySpecial?.title ?? ""}
            onChange={(e) => updateDailySpecial("title", e.target.value)}
            placeholder={t("dailySpecialTitlePlaceholder")}
            className={inputClass}
          />
          <textarea
            value={settings.dailySpecial?.description ?? ""}
            onChange={(e) => updateDailySpecial("description", e.target.value)}
            placeholder={t("dailySpecialDescPlaceholder")}
            rows={2}
            className={inputClass}
          />
          <input
            value={settings.dailySpecial?.price ?? ""}
            onChange={(e) => updateDailySpecial("price", e.target.value)}
            placeholder={t("dailySpecialPricePlaceholder")}
            className={inputClass}
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground">
          {t("tableServiceTitle")}
        </h3>
        <p className="mb-4 text-sm text-muted">{t("tableServiceHint")}</p>
        <div className="grid gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("kitchenWhatsApp")}</span>
            <input
              value={settings.kitchenWhatsApp ?? ""}
              onChange={(e) => update({ kitchenWhatsApp: e.target.value })}
              placeholder="+34 600 000 000"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("tableCount")}</span>
            <input
              type="number"
              min={0}
              max={50}
              value={settings.tableCount ?? 0}
              onChange={(e) =>
                update({ tableCount: Number(e.target.value) || 0 })
              }
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground">
          {t("hostedMenuTitle")}
        </h3>
        <p className="mb-3 text-sm text-muted">{t("hostedMenuHint")}</p>
        <button
          type="button"
          onClick={() =>
            update({ hostedMenu: buildHostedMenuTemplate() })
          }
          className="rounded-xl border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground hover:border-accent/40"
        >
          {t("hostedMenuSeed")}
        </button>
        {settings.hostedMenu?.sections?.length ? (
          <p className="mt-2 text-xs text-success">
            {t("hostedMenuActive", {
              count: settings.hostedMenu.sections.length,
            })}
          </p>
        ) : null}
      </section>

      <section>
        <h3 className="text-lg font-semibold text-foreground">
          {t("reservationsTitle")}
        </h3>
        <label className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.reservationsEnabled ?? false}
            onChange={(e) =>
              update({ reservationsEnabled: e.target.checked })
            }
          />
          <span className="text-sm">{t("reservationsEnabled")}</span>
        </label>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            {t("customDomainTitle")}
          </h3>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
            Pro
          </span>
        </div>
        <p className="mb-3 text-sm text-muted">{t("customDomainHint")}</p>
        <input
          value={settings.customDomain ?? ""}
          onChange={(e) => update({ customDomain: e.target.value })}
          placeholder="dsunset.menuhub.app"
          className={inputClass}
        />
      </section>
    </div>
  );
}
