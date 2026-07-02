import { setRequestLocale, getTranslations } from "next-intl/server";
import { LandingPage } from "@/components/LandingPage";
import { buildDemoRestaurant } from "@/lib/demo/getDemoRestaurant";

export default async function DemoLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("demo");
  const tDaily = await getTranslations("dailySpecial");
  const tDemoSpecial = await getTranslations("demo.dailySpecial");
  const restaurant = buildDemoRestaurant({
    name: t("restaurantName"),
    tagline: t("restaurantTagline"),
    menuInternalPath: "/r/demo/menu",
    dailySpecial: {
      title: tDemoSpecial("title"),
      description: tDemoSpecial("description"),
      price: tDemoSpecial("price"),
      active: true,
    },
  });

  return (
    <LandingPage
      restaurant={restaurant}
      tagline={t("restaurantTagline")}
      menuInternalHref="/r/demo/menu"
      reserveHref="/r/demo/reserve"
      dailySpecialProLabel={tDaily("badge")}
    />
  );
}
