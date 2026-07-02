"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
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
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
              ← {tCommon("back")}
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{t("title")}</h1>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <CopyLinkButton url={publicUrl} />
            <Link
              href={`/r/${restaurantId}`}
              className="text-sm font-medium text-blue-600 hover:underline"
              target="_blank"
            >
              {t("viewPage")} →
            </Link>

            <div>
              <h2 className="mb-2 text-lg font-semibold">{t("qrTitle")}</h2>
              <p className="mb-4 text-sm text-zinc-500">{t("qrHint")}</p>
              <QRDisplay dataUrl={qrDataUrl} restaurantName={initialValues.name} />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            {success ? (
              <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {t("saveSuccess")}
              </p>
            ) : null}
            <h2 className="mb-6 text-xl font-semibold">{tForm("editTitle")}</h2>
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
