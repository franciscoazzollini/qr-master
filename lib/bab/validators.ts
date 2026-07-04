import type { BabLinks, BabSettings, RestaurantTier } from "../types";
import { FREE_MAX_LINKS } from "../tiers";
import { normalizeUrl, normalizeWhatsApp, normalizePhoneDigits } from "../validators";

export function normalizeBabLinks(links: BabLinks = {}): BabLinks {
  const normalized: BabLinks = {};
  const keys = [
    "googleMaps",
    "instagram",
    "whatsapp",
    "booking",
    "restaurantMenu",
    "spa",
    "parking",
    "localGuide",
    "review",
    "emergency",
  ] as const;

  for (const key of keys) {
    const raw = links[key];
    if (!raw?.trim()) continue;
    if (key === "whatsapp") {
      const wa = normalizeWhatsApp(raw);
      if (wa) normalized.whatsapp = wa;
    } else if (key === "emergency") {
      const digits = normalizePhoneDigits(raw);
      if (digits) normalized.emergency = `tel:${digits}`;
      else {
        const url = normalizeUrl(raw);
        if (url) normalized.emergency = url;
      }
    } else {
      const url = normalizeUrl(raw);
      if (url) normalized[key] = url;
    }
  }

  return normalized;
}

export function countBabLinks(links: BabLinks): number {
  return Object.values(links).filter(Boolean).length;
}

export function normalizeBabSettings(settings: BabSettings = {}): BabSettings {
  const normalized: BabSettings = {};

  if (settings.wifi?.ssid?.trim()) {
    normalized.wifi = {
      ssid: settings.wifi.ssid.trim().slice(0, 64),
      password: settings.wifi.password?.trim().slice(0, 128) ?? "",
    };
  }

  if (settings.receptionHours) normalized.receptionHours = settings.receptionHours;
  if (settings.breakfastHours) normalized.breakfastHours = settings.breakfastHours;

  if (settings.checkInOut?.checkIn && settings.checkInOut?.checkOut) {
    normalized.checkInOut = {
      checkIn: settings.checkInOut.checkIn.slice(0, 5),
      checkOut: settings.checkInOut.checkOut.slice(0, 5),
    };
  }

  const receptionWhatsApp = normalizePhoneDigits(settings.receptionWhatsApp);
  if (receptionWhatsApp) normalized.receptionWhatsApp = receptionWhatsApp;

  if (settings.roomCount !== undefined) {
    const count = Math.min(50, Math.max(0, Math.floor(settings.roomCount)));
    if (count > 0) normalized.roomCount = count;
  }

  if (settings.customDomain?.trim()) {
    normalized.customDomain = settings.customDomain.trim().slice(0, 100);
  }

  if (settings.hostedMenu?.sections?.length) {
    normalized.hostedMenu = settings.hostedMenu;
  }

  if (settings.reservationsEnabled !== undefined) {
    normalized.reservationsEnabled = Boolean(settings.reservationsEnabled);
  }

  if (settings.venueDirections?.steps?.length) {
    normalized.venueDirections = {
      title: settings.venueDirections.title?.trim().slice(0, 100),
      steps: settings.venueDirections.steps
        .map((step) => step.trim())
        .filter(Boolean)
        .slice(0, 8),
    };
  }

  if (settings.houseRules?.rules?.length) {
    normalized.houseRules = {
      title: settings.houseRules.title?.trim().slice(0, 100),
      rules: settings.houseRules.rules
        .map((r) => r.trim())
        .filter(Boolean)
        .slice(0, 12),
    };
  }

  if (settings.serviceGuides?.length) {
    normalized.serviceGuides = settings.serviceGuides
      .filter((g) => g.title?.trim())
      .slice(0, 10)
      .map((g, i) => ({
        id: g.id || `guide-${i}`,
        title: g.title.trim().slice(0, 80),
        description: g.description?.trim().slice(0, 300) ?? "",
        link: g.link ? normalizeUrl(g.link) : undefined,
      }));
  }

  return normalized;
}

export function enforceBabTierOnLinks(
  tier: RestaurantTier,
  links: BabLinks,
): BabLinks {
  const normalized = normalizeBabLinks(links);
  if (tier === "pro") return normalized;

  const next = { ...normalized };
  delete next.whatsapp;

  const entries = Object.entries(next).filter(([, value]) => Boolean(value));
  if (entries.length <= FREE_MAX_LINKS) return next;

  const trimmed: BabLinks = {};
  for (const [key, value] of entries.slice(0, FREE_MAX_LINKS)) {
    trimmed[key as keyof BabLinks] = value;
  }
  return trimmed;
}

export function enforceBabTierOnSettings(
  tier: RestaurantTier,
  settings: BabSettings,
): BabSettings {
  if (tier === "pro") return settings;

  const next: BabSettings = { ...settings };
  delete next.hostedMenu;
  delete next.roomCount;
  delete next.receptionWhatsApp;
  delete next.customDomain;
  delete next.houseRules;
  delete next.serviceGuides;
  delete next.venueDirections;
  next.reservationsEnabled = false;

  return next;
}

export function mergeBabSettings(
  existing: BabSettings,
  updates: BabSettings,
): BabSettings {
  const merged: BabSettings = {
    ...existing,
    ...normalizeBabSettings(updates),
  };

  if (updates.wifi === undefined && existing.wifi) merged.wifi = existing.wifi;
  else if (updates.wifi && !updates.wifi.ssid?.trim()) delete merged.wifi;

  if (updates.receptionWhatsApp === undefined && existing.receptionWhatsApp) {
    merged.receptionWhatsApp = existing.receptionWhatsApp;
  } else if (
    updates.receptionWhatsApp !== undefined &&
    !updates.receptionWhatsApp?.trim()
  ) {
    delete merged.receptionWhatsApp;
  }

  if (updates.roomCount === 0) delete merged.roomCount;

  if (updates.hostedMenu === undefined && existing.hostedMenu) {
    merged.hostedMenu = existing.hostedMenu;
  }

  return merged;
}
