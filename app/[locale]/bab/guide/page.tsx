import { setRequestLocale, getTranslations } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { GuideStep } from "@/components/guide/GuideStep";
import { Link } from "@/i18n/routing";

export default async function BabGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bab.guide");
  const tCommon = await getTranslations("bab.common");

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <AppHeader
          appName={tCommon("appName")}
          tagline={tCommon("tagline")}
          homeHref="/bab"
          backHref="/bab"
          backLabel="Back"
        />
        <header>
          <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
        </header>
        <GuideStep step={1} title={t("steps.create.title")} description={t("steps.create.description")}>
          <Button href="/bab/new">{t("steps.create.cta")}</Button>
        </GuideStep>
        <GuideStep step={2} title={t("steps.dashboard.title")} description={t("steps.dashboard.description")}>
          <Button href="/bab/demo/dashboard" variant="secondary">
            {t("steps.dashboard.cta")}
          </Button>
        </GuideStep>
        <GuideStep step={3} title={t("steps.guest.title")} description={t("steps.guest.description")}>
          <Button href="/bab/demo/guest" variant="secondary">
            {t("steps.guest.cta")}
          </Button>
        </GuideStep>
        <Link href="/bab" className="text-sm font-medium text-accent hover:underline">
          ← B&B home
        </Link>
      </div>
    </div>
  );
}
