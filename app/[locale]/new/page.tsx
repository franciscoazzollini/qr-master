"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  RestaurantForm,
  type RestaurantFormValues,
} from "@/components/RestaurantForm";

export default function NewRestaurantPage() {
  const t = useTranslations("form");
  const tErrors = useTranslations("errors");
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
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <LanguageSwitcher />
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <RestaurantForm submitLabel={t("submit")} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
