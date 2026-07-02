"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { QRDisplay } from "@/components/QRDisplay";
import {
  RestaurantForm,
  type RestaurantFormValues,
} from "@/components/RestaurantForm";

interface DashboardClientProps {
  restaurantId: string;
  token: string;
  initialValues: RestaurantFormValues;
  publicUrl: string;
  qrDataUrl: string;
}

export function DashboardClient({
  restaurantId,
  token,
  initialValues,
  publicUrl,
  qrDataUrl,
}: DashboardClientProps) {
  const t = useTranslations("dashboard");
  const tForm = useTranslations("form");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = async (values: RestaurantFormValues) => {
    const response = await fetch(`/api/restaurants/${restaurantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? tErrors("generic"));
    }

    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <AppHeader backHref="/" backLabel={tCommon("back")} />

        <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <CopyLinkButton url={publicUrl} />
            <Link
              href={`/r/${restaurantId}`}
              className="text-sm font-medium text-accent hover:underline"
              target="_blank"
            >
              {t("viewPage")} →
            </Link>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                {t("qrTitle")}
              </h2>
              <p className="mb-4 text-sm text-muted">{t("qrHint")}</p>
              <QRDisplay
                dataUrl={qrDataUrl}
                restaurantName={initialValues.name}
              />
            </div>
          </div>

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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
