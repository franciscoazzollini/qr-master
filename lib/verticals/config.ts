import type { BabLinkKey } from "../types";

export type VenueVertical = "restaurant" | "bab";

export const BAB_LINK_ORDER: BabLinkKey[] = [
  "booking",
  "googleMaps",
  "restaurantMenu",
  "instagram",
  "whatsapp",
  "spa",
  "parking",
  "localGuide",
  "review",
  "emergency",
];

export const VERTICALS = {
  restaurant: {
    guestPrefix: "/r",
    dashboardPrefix: "/dashboard",
    newPath: "/new",
  },
  bab: {
    guestPrefix: "/bab/g",
    dashboardPrefix: "/bab/dashboard",
    newPath: "/bab/new",
  },
} as const satisfies Record<
  VenueVertical,
  { guestPrefix: string; dashboardPrefix: string; newPath: string }
>;
