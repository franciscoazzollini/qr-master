"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppHeader } from "@/components/AppHeader";
import {
  RestaurantForm,
  type RestaurantFormValues,
} from "@/components/RestaurantForm";
import {
  DEMO_EXTERNAL_LINKS,
  DEMO_LOGO_PATH,
  DEMO_PRIMARY_COLOR,
} from "@/lib/demo/config";
import { DEMO_SETTINGS } from "@/lib/demo/settings";

interface ExampleNewClientProps {
  locale: string;
}

export function ExampleNewClient({ locale }: ExampleNewClientProps) {
  const t = useTranslations("form");
  const tDemo = useTranslations("demo");
  const tCommon = useTranslations("common");

  const initialValues: RestaurantFormValues = {
    name: tDemo("restaurantName"),
    logoUrl: DEMO_LOGO_PATH,
    primaryColor: DEMO_PRIMARY_COLOR,
    locale,
    links: {
      menu: `/${locale}/r/demo/menu`,
      ...DEMO_EXTERNAL_LINKS,
    },
    settings: DEMO_SETTINGS,
  };

  const handleSubmit = async () => {
    setNotice(true);
    setTimeout(() => setNotice(false), 3000);
  };

  const [notice, setNotice] = useState(false);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <AppHeader backHref="/" backLabel={tCommon("back")} />

        <div className="mb-6 mt-4 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-foreground">
          {t("exampleBanner")}
        </div>

        <h1 className="mb-8 text-3xl font-bold text-foreground">
          {t("exampleTitle")}
        </h1>
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <RestaurantForm
            initialValues={initialValues}
            submitLabel={t("exampleSubmit")}
            onSubmit={handleSubmit}
            readOnly
          />
          {notice ? (
            <p className="mt-4 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-muted">
              {t("creationDisabled")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
