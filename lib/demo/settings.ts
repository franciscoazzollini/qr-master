import type { RestaurantSettings } from "../types";
import {
  DEMO_KITCHEN_WHATSAPP,
  DEMO_PRIMARY_COLOR,
  DEMO_RESTAURANT_ID,
} from "./config";

export const DEMO_RESTAURANT_ID_EXPORT = DEMO_RESTAURANT_ID;

export const DEMO_SETTINGS: RestaurantSettings = {
  wifi: {
    ssid: "LaTerraza_Guest",
    password: "welcome2024",
  },
  openingHours: {
    mon: { open: "12:00", close: "23:00" },
    tue: { open: "12:00", close: "23:00" },
    wed: { open: "12:00", close: "23:00" },
    thu: { open: "12:00", close: "23:00" },
    fri: { open: "12:00", close: "00:00" },
    sat: { open: "11:00", close: "00:00" },
    sun: { open: "11:00", close: "22:00" },
  },
  dailySpecial: {
    title: "Grilled Octopus",
    description: "Charred octopus, smoked paprika, lemon aioli, crispy potatoes",
    price: "€18",
    active: true,
  },
  kitchenWhatsApp: DEMO_KITCHEN_WHATSAPP,
  tableCount: 12,
  customDomain: "laterraza.menuhub.app",
  reservationsEnabled: true,
};

export { DEMO_RESTAURANT_ID, DEMO_PRIMARY_COLOR };
