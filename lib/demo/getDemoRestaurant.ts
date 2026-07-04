import type { DailySpecial, PublicRestaurant } from "@/lib/types";
import {
  DEMO_EXTERNAL_LINKS,
  DEMO_LOGO_PATH,
  DEMO_PRIMARY_COLOR,
  DEMO_RESTAURANT_ID,
} from "./config";
import { getDemoSettingsForTier, type DemoTier } from "./tier";

export interface DemoRestaurantInput {
  name: string;
  tagline?: string;
  menuInternalPath: string;
  tier?: DemoTier;
  dailySpecial?: DailySpecial;
}

export function buildDemoRestaurant({
  name,
  tagline,
  menuInternalPath,
  tier = "pro",
  dailySpecial,
}: DemoRestaurantInput): PublicRestaurant & { tagline?: string } {
  return {
    id: DEMO_RESTAURANT_ID,
    name,
    logoUrl: DEMO_LOGO_PATH,
    primaryColor: DEMO_PRIMARY_COLOR,
    locale: "en",
    tier,
    vertical: "restaurant",
    settings: getDemoSettingsForTier(tier, dailySpecial),
    tagline,
    links: {
      menu: menuInternalPath,
      googleMaps: DEMO_EXTERNAL_LINKS.googleMaps,
      instagram: DEMO_EXTERNAL_LINKS.instagram,
      ...(tier === "pro" ? { whatsapp: DEMO_EXTERNAL_LINKS.whatsapp } : {}),
      payment: DEMO_EXTERNAL_LINKS.payment,
      tip: DEMO_EXTERNAL_LINKS.tip,
    },
  };
}
