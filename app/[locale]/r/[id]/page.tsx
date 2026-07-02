import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/components/LandingPage";
import { getPublicRestaurant } from "@/lib/repositories/restaurant";

export default async function RestaurantPublicPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const restaurant = await getPublicRestaurant(id);
  if (!restaurant) {
    notFound();
  }

  const menuInternalHref = restaurant.settings.hostedMenu?.sections?.length
    ? `/r/${id}/menu`
    : undefined;

  return (
    <LandingPage
      restaurant={restaurant}
      menuInternalHref={menuInternalHref}
    />
  );
}
