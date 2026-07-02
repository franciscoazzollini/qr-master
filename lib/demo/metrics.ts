import type { RestaurantMetrics } from "@/lib/types";

export const DEMO_METRICS: RestaurantMetrics = {
  viewsToday: 47,
  views7d: 312,
  views30d: 1284,
  viewsPrev7d: 268,
  viewsTrend: 16,
  reservations7d: 23,
  reservationsPending: 4,
  reservationsConfirmed: 19,
  covers7d: 68,
  upcomingReservations: 7,
  conversionRate: 7.4,
  actions: {
    landing: 312,
    menu: 186,
    reserve: 41,
    table: 94,
  },
  viewsByDay: [
    { date: offsetDay(6), count: 38 },
    { date: offsetDay(5), count: 42 },
    { date: offsetDay(4), count: 51 },
    { date: offsetDay(3), count: 47 },
    { date: offsetDay(2), count: 55 },
    { date: offsetDay(1), count: 39 },
    { date: offsetDay(0), count: 47 },
  ],
  topPaths: [
    { path: "/", count: 312 },
    { path: "/menu", count: 186 },
    { path: "/table/12", count: 28 },
    { path: "/reserve", count: 41 },
    { path: "/menu/mains", count: 112 },
  ],
};

function offsetDay(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}
