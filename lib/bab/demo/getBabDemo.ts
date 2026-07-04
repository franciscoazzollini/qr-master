import type { BabLinks, BabSettings, PublicRestaurant } from "@/lib/types";
import {
  BAB_DEMO_EXTERNAL_LINKS,
  BAB_DEMO_ID,
  BAB_DEMO_LOGO_PATH,
  BAB_DEMO_PRIMARY_COLOR,
} from "./config";
import { getBabDemoSettingsForTier, type BabDemoTier } from "./tier";

export function buildBabDemoVenue({
  name,
  tagline,
  tier = "pro",
}: {
  name: string;
  tagline?: string;
  tier?: BabDemoTier;
}): PublicRestaurant & { tagline?: string } {
  const links: BabLinks =
    tier === "pro"
      ? { ...BAB_DEMO_EXTERNAL_LINKS }
      : {
          googleMaps: BAB_DEMO_EXTERNAL_LINKS.googleMaps,
          booking: BAB_DEMO_EXTERNAL_LINKS.booking,
          instagram: BAB_DEMO_EXTERNAL_LINKS.instagram,
          localGuide: BAB_DEMO_EXTERNAL_LINKS.localGuide,
        };

  return {
    id: BAB_DEMO_ID,
    name,
    logoUrl: BAB_DEMO_LOGO_PATH,
    primaryColor: BAB_DEMO_PRIMARY_COLOR,
    locale: "en",
    tier,
    vertical: "bab",
    settings: getBabDemoSettingsForTier(tier),
    links,
    tagline,
  };
}
