import type { PublicRestaurant } from "@/lib/types";
import {
  DEMO_EXTERNAL_LINKS,
  DEMO_LOGO_PATH,
  DEMO_PRIMARY_COLOR,
  DEMO_RESTAURANT_ID,
} from "./config";

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
    tier: "free",
    tagline,
    links: {
      menu: menuInternalPath,
      ...DEMO_EXTERNAL_LINKS,
    },
  };
}
