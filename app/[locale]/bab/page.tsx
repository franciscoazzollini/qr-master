import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/routing";

const featureKeys = [
  "wifi",
  "reception",
  "breakfast",
  "roomQr",
  "booking",
  "guides",
  "menu",
  "languages",
] as const;

const featureIcons: Record<(typeof featureKeys)[number], string> = {
  wifi: "📶",
  reception: "🛎️",
  breakfast: "☕",
  roomQr: "🚪",
  booking: "🏨",
  guides: "📖",
  menu: "📋",
  languages: "🌐",
};

export default async function BabHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bab.home");
  const tCommon = await getTranslations("bab.common");

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/15 via-background to-background" />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-8 sm:px-6">
          <AppHeader appName={tCommon("appName")} tagline={tCommon("tagline")} homeHref="/bab" />

          <section className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
                {tCommon("verticalBadge")}
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t("title")}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted">{t("subtitle")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/bab/demo/guest">{t("demoCta")}</Button>
                <Button href="/bab/demo/dashboard" variant="secondary">
                  {t("demoDashboardCta")}
                </Button>
                <Button href="/bab/guide" variant="secondary">
                  {t("guideCta")}
                </Button>
                <Button href="/bab/new" variant="secondary">
                  {t("cta")}
                </Button>
              </div>
              <p className="mt-4">
                <Link href="/" className="text-sm font-medium text-muted hover:text-accent">
                  {t("restaurantCta")}
                </Link>
              </p>
            </div>
            <Link href="/bab/demo/guest" className="mx-auto block w-full max-w-xs">
              <div className="rounded-[2.5rem] border-4 border-border bg-surface p-3 shadow-2xl transition-transform hover:scale-[1.02]">
                <div className="overflow-hidden rounded-[2rem] border border-border bg-surface-elevated p-6 text-center">
                  <span className="text-5xl">🏨</span>
                  <p className="mt-4 font-semibold text-foreground">Sea View B&B</p>
                  <p className="mt-2 text-xs text-muted">{t("examplePageHint")}</p>
                </div>
              </div>
            </Link>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">{t("showcaseCta")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featureKeys.map((key) => (
                <Card key={key}>
                  <span className="text-2xl">{featureIcons[key]}</span>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    {t(`features.${key}`)}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
