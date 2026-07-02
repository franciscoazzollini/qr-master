import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ReservationForm } from "@/components/ReservationForm";
import { buildDemoRestaurant } from "@/lib/demo/getDemoRestaurant";
import { DEMO_RESTAURANT_ID } from "@/lib/demo/config";
import { getPublicRestaurant } from "@/lib/repositories/restaurant";

export default async function ReservePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  if (id === DEMO_RESTAURANT_ID) {
    const restaurant = buildDemoRestaurant({
      name: "La Terraza",
      menuInternalPath: "/r/demo/menu",
    });
    return (
      <ReservationForm
        restaurantId={id}
        restaurantName={restaurant.name}
        primaryColor={restaurant.primaryColor}
        backHref={`/r/${id}`}
      />
    );
  }

  const restaurant = await getPublicRestaurant(id);
  if (!restaurant) {
    notFound();
  }

  if (!restaurant.settings.reservationsEnabled) {
    notFound();
  }

  return (
    <ReservationForm
      restaurantId={id}
      restaurantName={restaurant.name}
      primaryColor={restaurant.primaryColor}
      backHref={`/r/${id}`}
    />
  );
}
