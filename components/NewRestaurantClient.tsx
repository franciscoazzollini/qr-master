"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import {
  RestaurantForm,
  type RestaurantFormValues,
} from "@/components/RestaurantForm";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";

interface NewRestaurantClientProps {
  locale: string;
  isAuthenticated: boolean;
}

export function NewRestaurantClient({
  locale,
  isAuthenticated,
}: NewRestaurantClientProps) {
  const t = useTranslations("form");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const [step, setStep] = useState<"auth" | "setup">(
    isAuthenticated ? "setup" : "auth",
  );

  const [slug, setSlug] = useState("");

  const handleSubmit = async (values: RestaurantFormValues) => {
    const response = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...values,
        ...(slug.trim() ? { slug: slug.trim() } : {}),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? tErrors("createFailed"));
    }

    router.push(`/dashboard/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <AppHeader backHref="/" backLabel={tCommon("back")} />

        <h1 className="mb-2 mt-4 text-3xl font-bold text-foreground">
          {step === "auth" ? tAuth("createTitle") : t("title")}
        </h1>
        <p className="mb-8 text-sm text-muted">
          {step === "auth" ? tAuth("createSubtitle") : t("linksHint")}
        </p>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          {step === "auth" ? (
            <MagicLinkForm
              redirectPath={`/${locale}/new`}
              submitLabel={tAuth("continueWithEmail")}
            />
          ) : (
            <>
              <label className="mb-6 flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">
                  {t("slug")}
                </span>
                <span className="text-xs text-muted">{t("slugHint")}</span>
                <input
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder={t("slugPlaceholder")}
                  className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent"
                />
              </label>
              <RestaurantForm
              initialValues={{
                name: "",
                logoUrl: "",
                primaryColor: "#e07a3a",
                locale,
                links: {
                  menu: "",
                  googleMaps: "",
                  instagram: "",
                  whatsapp: "",
                  payment: "",
                  tip: "",
                },
                settings: { reservationsEnabled: false },
              }}
              submitLabel={t("submit")}
              onSubmit={handleSubmit}
            />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
