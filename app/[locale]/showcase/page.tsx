import { setRequestLocale, getTranslations } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { localeLabels, locales } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

const featureKeys = [
  "menu",
  "googleMaps",
  "instagram",
  "whatsapp",
  "payment",
  "reservation",
] as const;

const guestCards = [
  { key: "landing", href: "/r/demo" },
  { key: "menu", href: "/r/demo/menu" },
  { key: "menuDetail", href: "/r/demo/menu/mains" },
] as const;

export default async function ShowcasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const common = await getTranslations("common");
  const t = await getTranslations("demo.showcase");
  const tLinks = await getTranslations("links");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-8 sm:px-6">
        <AppHeader
          appName={common("appName")}
          tagline={common("tagline")}
        />

        <section className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/r/demo">{t("demoCta")}</Button>
            <Button href="/new" variant="secondary">
              {t("createCta")}
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">{t("guestTitle")}</h2>
          <p className="mt-2 text-muted">{t("guestSubtitle")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {guestCards.map(({ key, href }) => (
              <Link key={key} href={href}>
                <Card hover className="h-full">
                  <h3 className="font-semibold text-foreground">
                    {t(`cards.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {t(`cards.${key}.description`)}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">{t("ownerTitle")}</h2>
          <p className="mt-2 text-muted">{t("ownerSubtitle")}</p>
          <Link href="/demo/dashboard" className="mt-6 block">
            <Card hover>
              <h3 className="font-semibold text-foreground">
                {t("cards.dashboard.title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t("cards.dashboard.description")}
              </p>
            </Card>
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">
            {t("featuresTitle")}
          </h2>
          <p className="mt-2 text-muted">{t("featuresSubtitle")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map((key) => (
              <Card key={key}>
                <h3 className="font-semibold text-foreground">{tLinks(key)}</h3>
                <p className="mt-2 text-sm text-muted">
                  {t(`featureDescriptions.${key}`)}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-8">
          <h2 className="text-2xl font-bold text-foreground">
            {t("languagesTitle")}
          </h2>
          <p className="mt-2 text-muted">{t("languagesSubtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {locales.map((code) => (
              <span
                key={code}
                className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-sm text-foreground"
              >
                {localeLabels[code]}
              </span>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap gap-3 pb-8">
          <Button href="/r/demo">{t("demoCta")}</Button>
          <Button href="/new" variant="secondary">
            {t("createCta")}
          </Button>
        </section>
      </div>
    </div>
  );
}
