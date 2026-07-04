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
  reservationsTrend: 21,
  coversTrend: 18,
  payments7d: 54,
  paymentsTrend: 12,
  avgTicket: 38.5,
  avgTicketTrend: 8,
  funnel: {
    outsideScans: 124,
    scans: 188,
    menuViews: 186,
    reservations: 23,
    payments: 54,
  },
  actions: {
    outside: 124,
    landing: 188,
    menu: 186,
    reserve: 41,
    table: 94,
    payment: 54,
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
  prevWeekViewsByDay: [
    { date: offsetDay(13), count: 34 },
    { date: offsetDay(12), count: 36 },
    { date: offsetDay(11), count: 40 },
    { date: offsetDay(10), count: 38 },
    { date: offsetDay(9), count: 42 },
    { date: offsetDay(8), count: 37 },
    { date: offsetDay(7), count: 41 },
  ],
};

function offsetDay(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}
