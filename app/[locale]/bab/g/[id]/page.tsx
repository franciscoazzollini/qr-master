import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BabLandingPage } from "@/components/bab/BabLandingPage";
import { getRestaurant, enforcePublicVenue } from "@/lib/repositories/restaurant";
import { BAB_DEMO_ID } from "@/lib/bab/demo/config";

export default async function BabGuestPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  if (id === BAB_DEMO_ID) {
    notFound();
  }

  const restaurant = await getRestaurant(id);
  if (!restaurant || restaurant.vertical !== "bab") {
    notFound();
  }

  const venue = enforcePublicVenue(restaurant);

  return <BabLandingPage venue={venue} />;
}
