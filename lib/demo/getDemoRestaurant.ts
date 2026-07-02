import type { PublicRestaurant } from "@/lib/types";
import {
  DEMO_EXTERNAL_LINKS,
  DEMO_LOGO_PATH,
  DEMO_PRIMARY_COLOR,
  DEMO_RESTAURANT_ID,
} from "./config";
import { DEMO_SETTINGS } from "./settings";

export interface DemoRestaurantInput {
  name: string;
  tagline?: string;
  menuInternalPath: string;
}

export function buildDemoRestaurant({
  name,
  tagline,
  menuInternalPath,
}: DemoRestaurantInput): PublicRestaurant & { tagline?: string } {
  return {
    id: DEMO_RESTAURANT_ID,
    name,
    logoUrl: DEMO_LOGO_PATH,
    primaryColor: DEMO_PRIMARY_COLOR,
    locale: "en",
    tier: "pro",
    settings: DEMO_SETTINGS,
    tagline,
    links: {
      menu: menuInternalPath,
      googleMaps: DEMO_EXTERNAL_LINKS.googleMaps,
      instagram: DEMO_EXTERNAL_LINKS.instagram,
      whatsapp: DEMO_EXTERNAL_LINKS.whatsapp,
      payment: DEMO_EXTERNAL_LINKS.payment,
      tip: DEMO_EXTERNAL_LINKS.tip,
    },
  };
}
