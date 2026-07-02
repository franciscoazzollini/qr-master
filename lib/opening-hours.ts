import type { DayOfWeek, DayHours } from "./types";

const DAY_ORDER: DayOfWeek[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

const DAY_TO_INDEX: Record<DayOfWeek, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export function getTodayDayKey(): DayOfWeek {
  return DAY_ORDER[new Date().getDay()];
}

export function formatHoursRange(hours: DayHours): string {
  return `${hours.open} – ${hours.close}`;
}

export function getTodayHours(
  openingHours: Partial<Record<DayOfWeek, DayHours | null>> | undefined,
): DayHours | null | undefined {
  if (!openingHours) return undefined;
  return openingHours[getTodayDayKey()];
}

export function isOpenNow(
  openingHours: Partial<Record<DayOfWeek, DayHours | null>> | undefined,
): boolean | null {
  const today = getTodayHours(openingHours);
  if (today === undefined) return null;
  if (today === null) return false;

  const now = new Date();
  const [openH, openM] = today.open.split(":").map(Number);
  const [closeH, closeM] = today.close.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (closeMinutes <= openMinutes) {
    return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
  }
  return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
}

export { DAY_TO_INDEX };
