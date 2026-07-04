import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OutsideLeadPage } from "@/components/OutsideLeadPage";
import { DEMO_RESTAURANT_ID } from "@/lib/demo/config";
import { buildDemoRestaurant } from "@/lib/demo/getDemoRestaurant";
import { getPublicRestaurant } from "@/lib/repositories/restaurant";

export default async function RestaurantOutsidePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  if (id === DEMO_RESTAURANT_ID) {
    const t = await getTranslations("demo");
    const tOutside = await getTranslations("demo.outside");
    const restaurant = buildDemoRestaurant({
      name: t("restaurantName"),
      menuInternalPath: "/r/demo/menu",
    });

    return (
      <OutsideLeadPage
        restaurantId={id}
        restaurantName={restaurant.name}
        tagline={tOutside("subtitle")}
        primaryColor={restaurant.primaryColor}
        logoUrl={restaurant.logoUrl}
        menuHref="/r/demo/menu"
        insideHref="/r/demo"
        directionsTitle={tOutside("directionsTitle")}
        directionSteps={[
          tOutside("step1"),
          tOutside("step2"),
          tOutside("step3"),
          tOutside("step4"),
        ]}
        showDemoTierSwitch
      />
    );
  }

  const restaurant = await getPublicRestaurant(id);
  if (!restaurant) {
    notFound();
  }

  const tOutside = await getTranslations("demo.outside");
  const directions = restaurant.settings.venueDirections;
  const directionSteps =
    directions?.steps?.length && directions.steps.length > 0
      ? directions.steps
      : [
          tOutside("step1"),
          tOutside("step2"),
          tOutside("step3"),
          tOutside("step4"),
        ];

  const menuHref = restaurant.settings.hostedMenu?.sections?.length
    ? `/r/${id}/menu`
    : restaurant.links.menu ?? `/r/${id}`;

  return (
    <OutsideLeadPage
      restaurantId={id}
      restaurantName={restaurant.name}
      tagline={tOutside("subtitle")}
      primaryColor={restaurant.primaryColor}
      logoUrl={restaurant.logoUrl}
      menuHref={menuHref}
      insideHref={`/r/${id}`}
      directionsTitle={directions?.title ?? tOutside("directionsTitle")}
      directionSteps={directionSteps}
    />
  );
}
