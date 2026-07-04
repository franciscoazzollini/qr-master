"use client";

import { useTranslations } from "next-intl";
import { LandingPage } from "@/components/LandingPage";
import { buildDemoRestaurant } from "@/lib/demo/getDemoRestaurant";
import { useDemoTier } from "./DemoTierSwitch";

export function DemoLandingClient() {
  const tier = useDemoTier();
  const t = useTranslations("demo");
  const tDaily = useTranslations("dailySpecial");
  const tDemoSpecial = useTranslations("demo.dailySpecial");

  const dailySpecial =
    tier === "pro"
      ? {
          title: tDemoSpecial("title"),
          description: tDemoSpecial("description"),
          price: tDemoSpecial("price"),
          active: true,
        }
      : undefined;

  const restaurant = buildDemoRestaurant({
    name: t("restaurantName"),
    tagline: t("restaurantTagline"),
    menuInternalPath: "/r/demo/menu",
    tier,
    dailySpecial,
  });

  return (
    <LandingPage
      restaurant={restaurant}
      tagline={t("restaurantTagline")}
      menuInternalHref="/r/demo/menu"
      reserveHref={tier === "pro" ? "/r/demo/reserve" : undefined}
      dailySpecialProLabel={tDaily("badge")}
      demoTier={tier}
    />
  );
}
