import { TIER_FEATURES } from "../tiers";
import type { DailySpecial, RestaurantSettings, RestaurantTier } from "../types";
import { DEMO_SETTINGS } from "./settings";

export type DemoTier = RestaurantTier;

export function parseDemoTier(value: string | null | undefined): DemoTier {
  return value === "free" ? "free" : "pro";
}

export function getTierFeatures(tier: DemoTier) {
  return TIER_FEATURES[tier];
}

export function getDemoSettingsForTier(
  tier: DemoTier,
  dailySpecial?: DailySpecial,
): RestaurantSettings {
  if (tier === "pro") {
    return {
      ...DEMO_SETTINGS,
      ...(dailySpecial ? { dailySpecial } : {}),
    };
  }

  return {
    wifi: DEMO_SETTINGS.wifi,
    openingHours: DEMO_SETTINGS.openingHours,
    reservationsEnabled: false,
    dailySpecial: dailySpecial
      ? { ...dailySpecial, active: false }
      : { ...DEMO_SETTINGS.dailySpecial!, active: false },
  };
}
