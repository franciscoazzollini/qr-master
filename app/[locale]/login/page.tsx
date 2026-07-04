import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import { MagicLinkForm } from "@/components/auth/MagicLinkForm";
import { getSessionUser } from "@/lib/supabase/server";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth");
  const tCommon = await getTranslations("common");
  const user = await getSessionUser();

  if (user) {
    redirect({ href: "/account", locale });
    return null;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <AppHeader backHref="/" backLabel={tCommon("back")} />

        <h1 className="mb-2 mt-4 text-3xl font-bold text-foreground">
          {t("loginTitle")}
        </h1>
        <p className="mb-8 text-sm text-muted">{t("loginSubtitle")}</p>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <MagicLinkForm redirectPath={`/${locale}/account`} />
        </div>
      </div>
    </div>
  );
}
