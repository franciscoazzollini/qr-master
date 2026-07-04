"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import { BabForm, type BabFormValues } from "@/components/bab/BabForm";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";

interface BabNewClientProps {
  locale: string;
  isAuthenticated: boolean;
}

export function BabNewClient({ locale, isAuthenticated }: BabNewClientProps) {
  const t = useTranslations("bab.form");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const [step, setStep] = useState<"auth" | "setup">(
    isAuthenticated ? "setup" : "auth",
  );
  const [slug, setSlug] = useState("");

  const handleSubmit = async (values: BabFormValues) => {
    const response = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...values,
        vertical: "bab",
        ...(slug.trim() ? { slug: slug.trim() } : {}),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? tErrors("createFailed"));
    }
    router.push(`/bab/dashboard/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <AppHeader backHref="/bab" backLabel={tCommon("back")} />
        <h1 className="mb-2 mt-4 text-3xl font-bold text-foreground">
          {step === "auth" ? tAuth("createTitle") : t("title")}
        </h1>
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          {step === "auth" ? (
            <MagicLinkForm
              redirectPath={`/${locale}/bab/new`}
              submitLabel={tAuth("continueWithEmail")}
            />
          ) : (
            <>
              <label className="mb-6 flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">URL slug (optional)</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="sea-view-bb"
                  className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent"
                />
              </label>
              <BabForm
                initialValues={{
                  name: "",
                  logoUrl: "",
                  primaryColor: "#0d9488",
                  locale,
                  links: {},
                  settings: { reservationsEnabled: false },
                }}
                tier="free"
                submitLabel={tCommon("save")}
                onSubmit={handleSubmit}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
