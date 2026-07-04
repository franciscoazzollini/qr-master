import { FREE_MAX_LINKS, TIER_FEATURES } from "./tiers";
import type {
  RestaurantLinks,
  RestaurantSettings,
  RestaurantTier,
} from "./types";
import { countLinks, normalizeLinks } from "./validators";

export function enforceTierOnSettings(
  tier: RestaurantTier,
  settings: RestaurantSettings,
): RestaurantSettings {
  if (tier === "pro") {
    return settings;
  }

  const next: RestaurantSettings = { ...settings };
  delete next.hostedMenu;
  delete next.tableCount;
  delete next.kitchenWhatsApp;
  delete next.customDomain;
  delete next.dailySpecial;
  delete next.venueDirections;
  next.reservationsEnabled = false;

  return next;
}

export function enforceTierOnLinks(
  tier: RestaurantTier,
  links: RestaurantLinks,
): RestaurantLinks {
  const normalized = normalizeLinks(links);
  if (tier === "pro") {
    return normalized;
  }

  const next = { ...normalized };
  delete next.whatsapp;

  const entries = Object.entries(next).filter(([, value]) => Boolean(value));
  if (entries.length <= FREE_MAX_LINKS) {
    return normalized;
  }

  const trimmed: RestaurantLinks = {};
  for (const [key, value] of entries.slice(0, FREE_MAX_LINKS)) {
    trimmed[key as keyof RestaurantLinks] = value;
  }
  return trimmed;
}

export function tierAllowsFeature(
  tier: RestaurantTier,
  feature: Exclude<keyof typeof TIER_FEATURES.free, "maxLinks">,
): boolean {
  return TIER_FEATURES[tier][feature];
}

export function normalizeSlug(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

  if (slug.length < 3) {
    throw new Error("URL slug must be at least 3 characters");
  }

  const reserved = new Set(["demo", "bab-demo", "new", "login", "account", "api", "auth", "bab"]);
  if (reserved.has(slug)) {
    throw new Error("This URL slug is reserved");
  }

  return slug;
}
