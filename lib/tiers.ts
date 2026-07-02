import type { RestaurantTier } from "./types";

export const FREE_MAX_LINKS = 7;

export const TIER_FEATURES = {
  free: {
    maxLinks: FREE_MAX_LINKS,
    analytics: false,
    customDomain: false,
    multipleQR: false,
    customBranding: false,
    promotions: false,
    tableOrdering: false,
    tableQR: false,
  },
  pro: {
    maxLinks: Infinity,
    analytics: true,
    customDomain: true,
    multipleQR: true,
    customBranding: true,
    promotions: true,
    tableOrdering: true,
    tableQR: true,
  },
} as const satisfies Record<
  RestaurantTier,
  {
    maxLinks: number;
    analytics: boolean;
    customDomain: boolean;
    multipleQR: boolean;
    customBranding: boolean;
    promotions: boolean;
    tableOrdering: boolean;
    tableQR: boolean;
  }
>;

export function getMaxLinksForTier(tier: RestaurantTier): number {
  return TIER_FEATURES[tier].maxLinks;
}
