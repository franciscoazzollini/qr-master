import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const common = await getTranslations("common");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-xl font-bold">{common("appName")}</p>
          <p className="text-sm text-zinc-500">{common("tagline")}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
        <section className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600">{t("subtitle")}</p>
          <Link
            href="/new"
            className="mt-8 inline-flex rounded-2xl bg-zinc-900 px-6 py-4 text-lg font-semibold text-white"
          >
            {t("cta")}
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {(["fast", "mobile", "qr"] as const).map((key) => (
            <div
              key={key}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <p className="font-medium text-zinc-900">{t(`features.${key}`)}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
