"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import type { BabLinks, BabSettings, RestaurantTier } from "@/lib/types";
import { tierAllowsFeature } from "@/lib/tier-enforcement";
import { ProBadge, ProLockedSection } from "@/components/dashboard/ProLockedSection";

export interface BabFormValues {
  name: string;
  logoUrl: string;
  primaryColor: string;
  locale: string;
  links: BabLinks;
  settings: BabSettings;
}

interface BabFormProps {
  initialValues: BabFormValues;
  tier: RestaurantTier;
  submitLabel: string;
  onSubmit: (values: BabFormValues) => Promise<void>;
  settingsSection?: React.ReactNode;
}

const emptyLinks: BabLinks = {
  booking: "",
  googleMaps: "",
  instagram: "",
  whatsapp: "",
  restaurantMenu: "",
  spa: "",
  parking: "",
  localGuide: "",
  review: "",
  emergency: "",
};

const inputClass =
  "rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent";

export function BabForm({
  initialValues,
  tier,
  submitLabel,
  onSubmit,
  settingsSection,
}: BabFormProps) {
  const t = useTranslations("bab.form");
  const tCommon = useTranslations("common");
  const [values, setValues] = useState<BabFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isPro = tier === "pro";

  const updateLink = (key: keyof BabLinks, value: string) => {
    setValues((current) => ({
      ...current,
      links: { ...current.links, [key]: value },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const linkFields = [
    ["booking", t("booking"), false],
    ["googleMaps", t("googleMaps"), false],
    ["instagram", t("instagram"), false],
    ["whatsapp", t("whatsapp"), true],
    ["restaurantMenu", t("restaurantMenu"), false],
    ["spa", t("spa"), false],
    ["parking", t("parking"), false],
    ["localGuide", t("localGuide"), false],
    ["review", t("review"), false],
    ["emergency", t("emergency"), false],
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">{t("name")}</span>
          <input
            required
            value={values.name}
            onChange={(e) => setValues((c) => ({ ...c, name: e.target.value }))}
            placeholder={t("namePlaceholder")}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Logo URL</span>
          <input
            value={values.logoUrl}
            onChange={(e) => setValues((c) => ({ ...c, logoUrl: e.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Color</span>
          <input
            type="color"
            value={values.primaryColor}
            onChange={(e) =>
              setValues((c) => ({ ...c, primaryColor: e.target.value }))
            }
            className="h-12 w-full cursor-pointer rounded-xl border border-border bg-surface px-2"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Language</span>
          <select
            value={values.locale}
            onChange={(e) => setValues((c) => ({ ...c, locale: e.target.value }))}
            className={inputClass}
          >
            {locales.map((code) => (
              <option key={code} value={code}>
                {localeLabels[code as Locale]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("linksTitle")}</h2>
          <p className="text-sm text-muted">{t("linksHint")}</p>
        </div>
        {linkFields.map(([key, label, proOnly]) => {
          const field = (
            <label key={key} className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                {label}
                {proOnly && isPro ? <ProBadge /> : null}
              </span>
              <input
                value={values.links[key] ?? ""}
                onChange={(e) => updateLink(key, e.target.value)}
                className={inputClass}
                disabled={proOnly && !isPro}
              />
            </label>
          );

          if (proOnly && !tierAllowsFeature(tier, "whatsappLink")) {
            return (
              <ProLockedSection key={key} locked>
                {field}
              </ProLockedSection>
            );
          }
          return field;
        })}
      </div>

      {settingsSection ? (
        <div className="flex flex-col gap-4 border-t border-border pt-6">
          {settingsSection}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-accent-foreground transition-opacity disabled:opacity-60"
      >
        {loading ? tCommon("saving") : submitLabel}
      </button>
    </form>
  );
}
