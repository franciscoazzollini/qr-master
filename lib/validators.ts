import { FREE_MAX_LINKS } from "./tiers";
import {
  countBabLinks,
  enforceBabTierOnLinks,
  enforceBabTierOnSettings,
  normalizeBabLinks,
  normalizeBabSettings,
} from "./bab/validators";
import { enforceTierOnLinks, enforceTierOnSettings, normalizeSlug } from "./tier-enforcement";
import type {
  BabLinks,
  BabSettings,
  CreateRestaurantInput,
  CreateReservationInput,
  RestaurantLinks,
  RestaurantSettings,
  UpdateRestaurantInput,
} from "./types";

const URL_PATTERN = /^https?:\/\/.+/i;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (URL_PATTERN.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function normalizeWhatsApp(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (trimmed.includes("wa.me/")) {
    return normalizeUrl(trimmed);
  }

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return undefined;

  return `https://wa.me/${digits}`;
}

export function normalizePhoneDigits(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  return digits || undefined;
}

export function normalizeLinks(links: RestaurantLinks = {}): RestaurantLinks {
  const normalized: RestaurantLinks = {};

  const menu = normalizeUrl(links.menu);
  const googleMaps = normalizeUrl(links.googleMaps);
  const instagram = normalizeUrl(links.instagram);
  const whatsapp = normalizeWhatsApp(links.whatsapp);
  const payment = normalizeUrl(links.payment);
  const tip = normalizeUrl(links.tip);

  if (menu) normalized.menu = menu;
  if (googleMaps) normalized.googleMaps = googleMaps;
  if (instagram) normalized.instagram = instagram;
  if (whatsapp) normalized.whatsapp = whatsapp;
  if (payment) normalized.payment = payment;
  if (tip) normalized.tip = tip;

  return normalized;
}

export function normalizeSettings(
  settings: RestaurantSettings = {},
): RestaurantSettings {
  const normalized: RestaurantSettings = {};

  if (settings.wifi?.ssid?.trim()) {
    normalized.wifi = {
      ssid: settings.wifi.ssid.trim().slice(0, 64),
      password: settings.wifi.password?.trim().slice(0, 128) ?? "",
    };
  }

  if (settings.openingHours) {
    normalized.openingHours = settings.openingHours;
  }

  if (settings.dailySpecial?.title?.trim()) {
    normalized.dailySpecial = {
      title: settings.dailySpecial.title.trim().slice(0, 100),
      description: settings.dailySpecial.description?.trim().slice(0, 300) ?? "",
      price: settings.dailySpecial.price?.trim().slice(0, 20),
      active: Boolean(settings.dailySpecial.active),
    };
  }

  const kitchenWhatsApp = normalizePhoneDigits(settings.kitchenWhatsApp);
  if (kitchenWhatsApp) {
    normalized.kitchenWhatsApp = kitchenWhatsApp;
  }

  if (settings.tableCount !== undefined) {
    const count = Math.min(50, Math.max(0, Math.floor(settings.tableCount)));
    if (count > 0) normalized.tableCount = count;
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

  return normalized;
}

export function mergeSettings(
  existing: RestaurantSettings,
  updates: RestaurantSettings,
): RestaurantSettings {
  const merged: RestaurantSettings = { ...existing, ...normalizeSettings(updates) };

  if (updates.wifi === undefined && existing.wifi) {
    merged.wifi = existing.wifi;
  } else if (updates.wifi && !updates.wifi.ssid?.trim()) {
    delete merged.wifi;
  }

  if (updates.dailySpecial === undefined && existing.dailySpecial) {
    merged.dailySpecial = existing.dailySpecial;
  } else if (updates.dailySpecial && !updates.dailySpecial.title?.trim()) {
    delete merged.dailySpecial;
  }

  if (updates.kitchenWhatsApp === undefined && existing.kitchenWhatsApp) {
    merged.kitchenWhatsApp = existing.kitchenWhatsApp;
  } else if (updates.kitchenWhatsApp !== undefined && !updates.kitchenWhatsApp?.trim()) {
    delete merged.kitchenWhatsApp;
  }

  if (updates.tableCount === 0) {
    delete merged.tableCount;
  }

  if (updates.customDomain !== undefined && !updates.customDomain?.trim()) {
    delete merged.customDomain;
  }

  if (updates.hostedMenu === undefined && existing.hostedMenu) {
    merged.hostedMenu = existing.hostedMenu;
  }

  return merged;
}

export function countLinks(links: RestaurantLinks): number {
  return Object.values(links).filter(Boolean).length;
}

function validatePropertyName(name: string | undefined, vertical: "restaurant" | "bab"): string {
  const trimmed = name?.trim();
  if (!trimmed) {
    throw new Error(
      vertical === "bab" ? "Property name is required" : "Restaurant name is required",
    );
  }
  if (trimmed.length > 100) {
    throw new Error("Name must be 100 characters or less");
  }
  return trimmed;
}

function validateName(name: string | undefined): string {
  return validatePropertyName(name, "restaurant");
}

function validateColor(color: string | undefined): string {
  if (!color?.trim()) return "#2563eb";
  const trimmed = color.trim();
  if (!/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
    throw new Error("Primary color must be a valid hex color (e.g. #2563eb)");
  }
  return trimmed;
}

export function validateCreateInput(input: CreateRestaurantInput) {
  const vertical = input.vertical ?? "restaurant";
  const slug = input.slug ? normalizeSlug(input.slug) : undefined;

  if (vertical === "bab") {
    const links = normalizeBabLinks((input.links ?? {}) as BabLinks);
    const linkCount = countBabLinks(links);

    if (linkCount > FREE_MAX_LINKS) {
      throw new Error(`Free tier allows up to ${FREE_MAX_LINKS} links`);
    }

    const settings = enforceBabTierOnSettings(
      "free",
      normalizeBabSettings((input.settings ?? {}) as BabSettings),
    );

    return {
      name: validatePropertyName(input.name, "bab"),
      slug,
      logoUrl: normalizeUrl(input.logoUrl) ?? null,
      primaryColor: validateColor(input.primaryColor),
      locale: input.locale?.trim() || "en",
      links: enforceBabTierOnLinks("free", links),
      settings,
      vertical: "bab" as const,
    };
  }

  const links = normalizeLinks(input.links as RestaurantLinks);
  const linkCount = countLinks(links);

  if (linkCount > FREE_MAX_LINKS) {
    throw new Error(`Free tier allows up to ${FREE_MAX_LINKS} links`);
  }

  const settings = enforceTierOnSettings(
    "free",
    normalizeSettings(input.settings as RestaurantSettings),
  );

  return {
    name: validateName(input.name),
    slug,
    logoUrl: normalizeUrl(input.logoUrl) ?? null,
    primaryColor: validateColor(input.primaryColor),
    locale: input.locale?.trim() || "en",
    links: enforceTierOnLinks("free", links),
    settings,
    vertical: "restaurant" as const,
  };
}

export function validateUpdateInput(
  input: UpdateRestaurantInput,
  tier: "free" | "pro" = "free",
  vertical: "restaurant" | "bab" = "restaurant",
) {
  const result: {
    name?: string;
    logoUrl?: string | null;
    primaryColor?: string;
    locale?: string;
    links?: RestaurantLinks | BabLinks;
    settings?: RestaurantSettings | BabSettings;
  } = {};

  if (input.name !== undefined) {
    result.name = validatePropertyName(input.name, vertical);
  }
  if (input.logoUrl !== undefined) {
    result.logoUrl = input.logoUrl
      ? normalizeUrl(input.logoUrl) ?? null
      : null;
  }
  if (input.primaryColor !== undefined) {
    result.primaryColor = validateColor(input.primaryColor);
  }
  if (input.locale !== undefined) {
    result.locale = input.locale.trim() || "en";
  }
  if (input.links !== undefined) {
    const maxLinks = tier === "pro" ? Infinity : FREE_MAX_LINKS;
    if (vertical === "bab") {
      const links = normalizeBabLinks(input.links as BabLinks);
      if (countBabLinks(links) > maxLinks) {
        throw new Error(`Free tier allows up to ${FREE_MAX_LINKS} links`);
      }
      result.links = enforceBabTierOnLinks(tier, links);
    } else {
      const links = normalizeLinks(input.links as RestaurantLinks);
      if (countLinks(links) > maxLinks) {
        throw new Error(`Free tier allows up to ${FREE_MAX_LINKS} links`);
      }
      result.links = enforceTierOnLinks(tier, links);
    }
  }
  if (input.settings !== undefined) {
    if (vertical === "bab") {
      result.settings = enforceBabTierOnSettings(
        tier,
        normalizeBabSettings(input.settings as BabSettings),
      );
    } else {
      result.settings = enforceTierOnSettings(
        tier,
        normalizeSettings(input.settings as RestaurantSettings),
      );
    }
  }

  return result;
}

export function validateCreateReservationInput(input: CreateReservationInput) {
  const guestName = input.guestName?.trim();
  if (!guestName || guestName.length > 100) {
    throw new Error("Guest name is required");
  }

  const guestPhone = normalizePhoneDigits(input.guestPhone);
  if (!guestPhone || guestPhone.length < 6) {
    throw new Error("Valid phone number is required");
  }

  if (!input.reservationDate || !DATE_PATTERN.test(input.reservationDate)) {
    throw new Error("Valid reservation date is required");
  }

  if (!input.reservationTime || !TIME_PATTERN.test(input.reservationTime)) {
    throw new Error("Valid reservation time is required");
  }

  const partySize = Number(input.partySize);
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 50) {
    throw new Error("Party size must be between 1 and 50");
  }

  return {
    guestName,
    guestPhone,
    reservationDate: input.reservationDate,
    reservationTime: input.reservationTime,
    partySize,
    notes: input.notes?.trim().slice(0, 500) || undefined,
  };
}
