"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import type { RestaurantLinks, RestaurantSettings, RestaurantTier } from "@/lib/types";
import { tierAllowsFeature } from "@/lib/tier-enforcement";
import { ProBadge, ProLockedSection } from "@/components/dashboard/ProLockedSection";

export interface RestaurantFormValues {
  name: string;
  logoUrl: string;
  primaryColor: string;
  locale: string;
  links: RestaurantLinks;
  settings: RestaurantSettings;
}

interface RestaurantFormProps {
  initialValues?: RestaurantFormValues;
  submitLabel: string;
  onSubmit: (values: RestaurantFormValues) => Promise<void>;
  settingsSection?: React.ReactNode;
  readOnly?: boolean;
  tier?: RestaurantTier;
}

const emptyLinks: RestaurantLinks = {
  menu: "",
  googleMaps: "",
  instagram: "",
  whatsapp: "",
  payment: "",
  tip: "",
};

const defaultSettings: RestaurantSettings = {
  reservationsEnabled: true,
};

const defaultValues: RestaurantFormValues = {
  name: "",
  logoUrl: "",
  primaryColor: "#2563eb",
  locale: "en",
  links: { ...emptyLinks },
  settings: { ...defaultSettings },
};

const inputClassName =
  "rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent";

export function RestaurantForm({
  initialValues,
  submitLabel,
  onSubmit,
  settingsSection,
  readOnly = false,
  tier = "free",
}: RestaurantFormProps) {
  const t = useTranslations("form");
  const tCommon = useTranslations("common");
  const isPro = tier === "pro";
  const [values, setValues] = useState<RestaurantFormValues>(
    initialValues ?? defaultValues,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateLink = (key: keyof RestaurantLinks, value: string) => {
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
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">{t("name")}</span>
          <input
            required
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            placeholder={t("namePlaceholder")}
            className={inputClassName}
            disabled={readOnly}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">{t("logoUrl")}</span>
          <input
            value={values.logoUrl}
            onChange={(event) =>
              setValues((current) => ({ ...current, logoUrl: event.target.value }))
            }
            placeholder={t("logoUrlPlaceholder")}
            className={inputClassName}
            disabled={readOnly}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            {t("primaryColor")}
          </span>
          <input
            type="color"
            value={values.primaryColor}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                primaryColor: event.target.value,
              }))
            }
            className="h-12 w-full cursor-pointer rounded-xl border border-border bg-surface px-2"
            disabled={readOnly}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">{t("locale")}</span>
          <select
            value={values.locale}
            onChange={(event) =>
              setValues((current) => ({ ...current, locale: event.target.value }))
            }
            className={inputClassName}
            disabled={readOnly}
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

        {(
          [
            ["menu", t("menu"), false],
            ["googleMaps", t("googleMaps"), false],
            ["instagram", t("instagram"), false],
            ["whatsapp", t("whatsapp"), true],
            ["payment", t("payment"), false],
            ["tip", t("tip"), false],
          ] as const
        ).map(([key, label, proOnly]) => {
          const field = (
            <label key={key} className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                {label}
                {proOnly && isPro ? <ProBadge /> : null}
              </span>
              <input
                value={values.links[key] ?? ""}
                onChange={(event) => updateLink(key, event.target.value)}
                placeholder={t("urlPlaceholder")}
                className={inputClassName}
                disabled={readOnly || (proOnly && !isPro)}
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
          <div
            onChange={() => {}}
            className="flex flex-col gap-4 border-t border-border pt-6"
          >
            {settingsSection}
          </div>
        ) : null}

      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {readOnly ? (
        <p className="rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
          {t("creationDisabled")}
        </p>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-accent-foreground transition-opacity disabled:opacity-60"
        >
          {loading ? tCommon("saving") : submitLabel}
        </button>
      )}
    </form>
  );
}
