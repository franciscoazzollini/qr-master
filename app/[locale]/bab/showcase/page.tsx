import { setRequestLocale, getTranslations } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/routing";

const guestCards = [
  { key: "landing", href: "/bab/demo/guest" },
  { key: "welcome", href: "/bab/demo/guest/welcome" },
  { key: "room", href: "/bab/demo/guest/room/3" },
] as const;

const featureKeys = [
  "booking",
  "googleMaps",
  "restaurantMenu",
  "instagram",
  "whatsapp",
  "spa",
  "localGuide",
] as const;

export default async function BabShowcasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bab.showcase");
  const tLinks = await getTranslations("bab.links");
  const tCommon = await getTranslations("bab.common");

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <AppHeader
          appName={tCommon("appName")}
          tagline={tCommon("tagline")}
          homeHref="/bab"
        />
        <section>
          <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/bab/demo/guest">{t("demoCta")}</Button>
            <Button href="/bab/guide" variant="secondary">
              {t("guideCta")}
            </Button>
            <Button href="/bab/new" variant="secondary">
              {t("createCta")}
            </Button>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold">{t("guestTitle")}</h2>
          <p className="mt-2 text-muted">{t("guestSubtitle")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {guestCards.map(({ key, href }) => (
              <Link key={key} href={href}>
                <Card hover className="h-full">
                  <h3 className="font-semibold">{t(`cards.${key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted">{t(`cards.${key}.description`)}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold">{t("featuresTitle")}</h2>
          <p className="mt-2 text-muted">{t("featuresSubtitle")}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {featureKeys.map((key) => (
              <div
                key={key}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium"
              >
                {tLinks(key)}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
