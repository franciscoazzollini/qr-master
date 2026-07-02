import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/routing";

const featureKeys = [
  "menu",
  "reviews",
  "instagram",
  "whatsapp",
  "payment",
  "reservation",
  "languages",
  "fast",
] as const;

const featureIcons: Record<(typeof featureKeys)[number], string> = {
  menu: "📋",
  reviews: "⭐",
  instagram: "📸",
  whatsapp: "💬",
  payment: "💳",
  reservation: "📅",
  languages: "🌐",
  fast: "⚡",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tLinks = await getTranslations("links");
  const common = await getTranslations("common");

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-background to-background" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-8 sm:px-6">
          <AppHeader
            appName={common("appName")}
            tagline={common("tagline")}
          />

          <section className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t("title")}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                {t("subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/r/demo">{t("examplePageCta")}</Button>
                <Button href="/guide" variant="secondary">
                  {t("guideCta")}
                </Button>
                <Button href="/new" variant="secondary">
                  {t("cta")}
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted">{t("examplePageHint")}</p>
            </div>

            <Link href="/r/demo" className="mx-auto block w-full max-w-xs">
              <div className="rounded-[2.5rem] border-4 border-border bg-surface p-3 shadow-2xl transition-transform hover:scale-[1.02]">
                <div className="overflow-hidden rounded-[2rem] border border-border bg-surface-elevated">
                  <div className="bg-accent/20 px-4 py-3 text-center text-xs font-medium text-muted">
                    {common("appName")} — {t("examplePageCta")}
                  </div>
                  <div className="flex flex-col items-center gap-4 p-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e07a3a] text-2xl text-white">
                      🍽️
                    </div>
                    <div>
                      <p className="font-bold text-foreground">La Terraza</p>
                      <p className="text-xs text-muted">Mediterranean kitchen</p>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      {(["menu", "googleMaps", "whatsapp"] as const).map((key) => (
                        <div
                          key={key}
                          className="rounded-xl bg-[#e07a3a] px-3 py-2.5 text-xs font-semibold text-white"
                        >
                          {tLinks(key)}
                        </div>
                      ))}
                      <div className="rounded-xl border border-dashed border-[#e07a3a]/50 px-3 py-2 text-xs text-muted">
                        {t("exampleMoreButtons")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          <section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featureKeys.map((key) => (
                <Card key={key} hover>
                  <span className="text-2xl" aria-hidden>
                    {featureIcons[key]}
                  </span>
                  <p className="mt-3 font-medium text-foreground">
                    {t(`features.${key}`)}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {t("showcaseCta")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">{t("subtitle")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/r/demo">{t("examplePageCta")}</Button>
              <Button href="/guide" variant="secondary">
                {t("guideCta")}
              </Button>
              <Button href="/demo/dashboard" variant="secondary">
                {t("dashboardPreview")}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
