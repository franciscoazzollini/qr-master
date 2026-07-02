"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import {
  RestaurantForm,
  type RestaurantFormValues,
} from "@/components/RestaurantForm";

export default function NewRestaurantPage() {
  const t = useTranslations("form");
  const tErrors = useTranslations("errors");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const handleSubmit = async (values: RestaurantFormValues) => {
    const response = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? tErrors("createFailed"));
    }

    router.push(
      `/dashboard/${data.id}?token=${encodeURIComponent(data.editToken)}`,
    );
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <AppHeader backHref="/" backLabel={tCommon("back")} />
        <h1 className="mb-8 mt-4 text-3xl font-bold text-foreground">
          {t("title")}
        </h1>
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <RestaurantForm submitLabel={t("submit")} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
