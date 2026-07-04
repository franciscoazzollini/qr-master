import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { listRestaurantsByOwner } from "@/lib/repositories/restaurant";
import { getRestaurantPublicUrl } from "@/lib/qr";
import { getSessionUser } from "@/lib/supabase/server";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth");
  const tCommon = await getTranslations("common");
  const tDashboard = await getTranslations("dashboard");
  const user = await getSessionUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  const restaurants = await listRestaurantsByOwner(user.id);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <AppHeader backHref="/" backLabel={tCommon("back")} />

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("accountTitle")}</h1>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <Button href="/new">{t("createRestaurant")}</Button>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {restaurants.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
              <p className="text-muted">{t("noRestaurants")}</p>
              <Button href="/new" className="mt-4">
                {t("createRestaurant")}
              </Button>
            </div>
          ) : (
            restaurants.map((restaurant) => {
              const publicPath = restaurant.slug ?? restaurant.id;
              const publicUrl = getRestaurantPublicUrl(publicPath, locale);

              return (
                <div
                  key={restaurant.id}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {restaurant.name}
                      </h2>
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                        {restaurant.tier} · /r/{publicPath}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/${restaurant.id}`}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      {tDashboard("title")} →
                    </Link>
                  </div>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-muted hover:text-foreground"
                  >
                    {tDashboard("viewPage")} →
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
