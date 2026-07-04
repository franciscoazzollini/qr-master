import { TIER_FEATURES } from "../../tiers";
import type { BabSettings, RestaurantTier } from "@/lib/types";
import { BAB_DEMO_SETTINGS } from "./settings";

export type BabDemoTier = RestaurantTier;

export function parseBabDemoTier(value: string | null | undefined): BabDemoTier {
  return value === "free" ? "free" : "pro";
}

export function getBabDemoSettingsForTier(tier: BabDemoTier): BabSettings {
  if (tier === "pro") return { ...BAB_DEMO_SETTINGS };

  return {
    wifi: BAB_DEMO_SETTINGS.wifi,
    receptionHours: BAB_DEMO_SETTINGS.receptionHours,
    breakfastHours: BAB_DEMO_SETTINGS.breakfastHours,
    checkInOut: BAB_DEMO_SETTINGS.checkInOut,
    venueDirections: BAB_DEMO_SETTINGS.venueDirections,
    reservationsEnabled: false,
  };
}

export function babTierAllowsFeature(
  tier: BabDemoTier,
  feature: Exclude<keyof typeof TIER_FEATURES.free, "maxLinks">,
): boolean {
  return TIER_FEATURES[tier][feature];
}
