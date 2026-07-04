import type { BabSettings } from "@/lib/types";
import {
  BAB_DEMO_EXTERNAL_LINKS,
  BAB_DEMO_RECEPTION_WHATSAPP,
} from "./config";

export const BAB_DEMO_SETTINGS: BabSettings = {
  wifi: { ssid: "SeaView_Guest", password: "welcome2024" },
  receptionHours: {
    mon: { open: "07:00", close: "22:00" },
    tue: { open: "07:00", close: "22:00" },
    wed: { open: "07:00", close: "22:00" },
    thu: { open: "07:00", close: "22:00" },
    fri: { open: "07:00", close: "23:00" },
    sat: { open: "08:00", close: "23:00" },
    sun: { open: "08:00", close: "21:00" },
  },
  breakfastHours: {
    mon: { open: "07:30", close: "10:30" },
    tue: { open: "07:30", close: "10:30" },
    wed: { open: "07:30", close: "10:30" },
    thu: { open: "07:30", close: "10:30" },
    fri: { open: "07:30", close: "11:00" },
    sat: { open: "08:00", close: "11:00" },
    sun: { open: "08:00", close: "10:30" },
  },
  checkInOut: { checkIn: "15:00", checkOut: "11:00" },
  receptionWhatsApp: BAB_DEMO_RECEPTION_WHATSAPP,
  roomCount: 6,
  reservationsEnabled: true,
  venueDirections: {
    title: "Finding us",
    steps: [
      "From the main road, turn at the blue Sea View sign.",
      "Park in the guest lot on the left.",
      "Reception is through the garden archway.",
    ],
  },
  houseRules: {
    title: "House rules",
    rules: [
      "Quiet hours 22:00–08:00",
      "No smoking indoors",
      "Please lock your room when leaving",
    ],
  },
  serviceGuides: [
    {
      id: "ac",
      title: "Air conditioning",
      description: "Remote in the drawer. Set to 22°C for comfort.",
    },
    {
      id: "pool",
      title: "Pool & towels",
      description: "Pool open 09:00–20:00. Extra towels at reception.",
      link: "https://example.com/pool",
    },
  ],
};

export { BAB_DEMO_EXTERNAL_LINKS };
