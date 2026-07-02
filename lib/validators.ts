import { FREE_MAX_LINKS } from "./tiers";
import type { CreateRestaurantInput, RestaurantLinks, UpdateRestaurantInput } from "./types";

const URL_PATTERN = /^https?:\/\/.+/i;

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

export function normalizeLinks(links: RestaurantLinks = {}): RestaurantLinks {
  const normalized: RestaurantLinks = {};

  const menu = normalizeUrl(links.menu);
  const googleMaps = normalizeUrl(links.googleMaps);
  const instagram = normalizeUrl(links.instagram);
  const whatsapp = normalizeWhatsApp(links.whatsapp);
  const payment = normalizeUrl(links.payment);
  const reservation = normalizeUrl(links.reservation);

  if (menu) normalized.menu = menu;
  if (googleMaps) normalized.googleMaps = googleMaps;
  if (instagram) normalized.instagram = instagram;
  if (whatsapp) normalized.whatsapp = whatsapp;
  if (payment) normalized.payment = payment;
  if (reservation) normalized.reservation = reservation;

  return normalized;
}

export function countLinks(links: RestaurantLinks): number {
  return Object.values(links).filter(Boolean).length;
}

function validateName(name: string | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) {
    throw new Error("Restaurant name is required");
  }
  if (trimmed.length > 100) {
    throw new Error("Restaurant name must be 100 characters or less");
  }
  return trimmed;
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
  const links = normalizeLinks(input.links);
  const linkCount = countLinks(links);

  if (linkCount > FREE_MAX_LINKS) {
    throw new Error(`Free tier allows up to ${FREE_MAX_LINKS} links`);
  }

  return {
    name: validateName(input.name),
    logoUrl: normalizeUrl(input.logoUrl) ?? null,
    primaryColor: validateColor(input.primaryColor),
    locale: input.locale?.trim() || "en",
    links,
  };
}

export function validateUpdateInput(input: UpdateRestaurantInput) {
  const result: {
    name?: string;
    logoUrl?: string | null;
    primaryColor?: string;
    locale?: string;
    links?: RestaurantLinks;
  } = {};

  if (input.name !== undefined) {
    result.name = validateName(input.name);
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
    const links = normalizeLinks(input.links);
    if (countLinks(links) > FREE_MAX_LINKS) {
      throw new Error(`Free tier allows up to ${FREE_MAX_LINKS} links`);
    }
    result.links = links;
  }

  return result;
}
