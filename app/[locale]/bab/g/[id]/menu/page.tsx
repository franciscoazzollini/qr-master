import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { AppHeader } from "@/components/AppHeader";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getPublicRestaurant } from "@/lib/repositories/restaurant";

export default async function BabMenuPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  setRequestLocale((await params).locale);

  const venue = await getPublicRestaurant(id);
  if (!venue || venue.vertical !== "bab" || !venue.settings.hostedMenu?.sections?.length) {
    notFound();
  }

  const menu = venue.settings.hostedMenu;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <PageViewTracker restaurantId={id} path="/menu" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <AppHeader backHref={`/bab/g/${id}`} backLabel={venue.name} homeHref="/bab" />
        <h1 className="text-3xl font-bold">Menu</h1>
        <div className="flex flex-col gap-5">
          {menu.sections.map((section) => (
            <Link
              key={section.id}
              href={`/bab/g/${id}/menu/${section.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
            >
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={section.coverImage}
                  alt={section.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-5 text-white">
                  <h2 className="text-xl font-bold">{section.title}</h2>
                  <p className="text-sm text-white/80">{section.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
