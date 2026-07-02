import { setRequestLocale, getTranslations } from "next-intl/server";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import {
  GuideMockup,
  GuideProCard,
  GuideStep,
} from "@/components/guide/GuideStep";
import { Link } from "@/i18n/routing";

const linkKeys = [
  "menu",
  "googleMaps",
  "instagram",
  "whatsapp",
  "payment",
  "tip",
] as const;

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const common = await getTranslations("common");
  const t = await getTranslations("guide");
  const tLinks = await getTranslations("links");
  const tRes = await getTranslations("reservations");
  const tForm = await getTranslations("form");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-5 py-8">
        <AppHeader appName={common("appName")} tagline={common("tagline")} />

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{t("subtitle")}</p>
        </header>

        <GuideStep step={1} title={t("steps.create.title")} description={t("steps.create.description")}>
          <GuideMockup title={tForm("title")}>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-border bg-surface-elevated px-3 py-2 text-muted">
                {tForm("name")}: La Terraza
              </div>
              <div className="rounded-xl border border-border bg-surface-elevated px-3 py-2 text-muted">
                {tForm("primaryColor")}: #e07a3a
              </div>
              <Button href="/new" className="w-full text-sm">
                {t("steps.create.cta")}
              </Button>
            </div>
          </GuideMockup>
        </GuideStep>

        <GuideStep step={2} title={t("steps.dashboard.title")} description={t("steps.dashboard.description")}>
          <GuideMockup title={t("steps.dashboard.mockTitle")}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface-elevated p-3 text-center text-xs text-muted">
                QR preview
              </div>
              <div className="rounded-xl border border-border bg-surface-elevated p-3 text-xs text-muted">
                {t("steps.dashboard.editHint")}
              </div>
            </div>
            <Button href="/demo/dashboard" variant="secondary" className="mt-3 w-full text-sm">
              {t("steps.dashboard.cta")}
            </Button>
          </GuideMockup>
        </GuideStep>

        <GuideStep step={3} title={t("steps.links.title")} description={t("steps.links.description")}>
          <div className="grid gap-2 sm:grid-cols-2">
            {linkKeys.map((key) => (
              <div
                key={key}
                className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-foreground"
              >
                {tLinks(key)}
              </div>
            ))}
            <div className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm font-medium text-foreground sm:col-span-2">
              {tRes("reserveButton")} — {t("steps.links.reservationHint")}
            </div>
          </div>
        </GuideStep>

        <GuideStep step={4} title={t("steps.menu.title")} description={t("steps.menu.description")}>
          <div className="flex flex-wrap gap-3">
            <Button href="/r/demo/menu" variant="secondary" className="text-sm">
              {t("steps.menu.cta")}
            </Button>
            <Button href="/r/demo/menu/mains" variant="secondary" className="text-sm">
              {t("steps.menu.sampleCta")}
            </Button>
          </div>
        </GuideStep>

        <GuideStep step={5} title={t("steps.print.title")} description={t("steps.print.description")} />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{t("pro.title")}</h2>
          <p className="text-muted">{t("pro.subtitle")}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <GuideProCard
              badge="Pro"
              title={t("pro.tableQr.title")}
              description={t("pro.tableQr.description")}
            />
            <GuideProCard
              badge="Pro"
              title={t("pro.analytics.title")}
              description={t("pro.analytics.description")}
            />
          </div>
          <Button href="/r/demo/table/12" variant="secondary">
            {t("pro.tableQr.cta")}
          </Button>
        </section>

        <section className="flex flex-wrap gap-3 border-t border-border pt-8">
          <Button href="/new">{t("cta.create")}</Button>
          <Button href="/demo/dashboard" variant="secondary">
            {t("cta.dashboard")}
          </Button>
          <Button href="/r/demo" variant="secondary">
            {t("cta.demo")}
          </Button>
        </section>
      </div>
    </div>
  );
}
