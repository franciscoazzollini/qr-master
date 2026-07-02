import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { AppHeader } from "@/components/AppHeader";
import { getPublicRestaurant } from "@/lib/repositories/restaurant";

export default async function HostedMenuIndexPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const restaurant = await getPublicRestaurant(id);
  if (!restaurant?.settings.hostedMenu?.sections?.length) {
    notFound();
  }

  const menu = restaurant.settings.hostedMenu;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <AppHeader backHref={`/r/${id}`} backLabel={restaurant.name} />
        <div>
          <p className="text-sm font-medium text-muted">{restaurant.name}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Menu
          </h1>
        </div>
        <div className="flex flex-col gap-5">
          {menu.sections.map((section) => (
            <Link
              key={section.id}
              href={`/r/${id}/menu/${section.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:border-accent/40 hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={section.coverImage}
                  alt={section.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h2 className="text-xl font-bold">{section.title}</h2>
                  <p className="mt-1 text-sm text-white/80">{section.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
