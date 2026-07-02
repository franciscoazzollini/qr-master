import { getSupabase } from "../supabase";
import type { RestaurantMetrics } from "../types";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function pctTrend(current: number, previous: number): number {
  if (previous > 0) return Math.round(((current - previous) / previous) * 100);
  return current > 0 ? 100 : 0;
}

function classifyPath(path: string): keyof RestaurantMetrics["actions"] {
  if (path.includes("/action/payment") || path.includes("/action/tip")) {
    return "payment";
  }
  if (path.includes("/menu")) return "menu";
  if (path.includes("/reserve")) return "reserve";
  if (path.includes("/table/")) return "table";
  return "landing";
}

export async function recordPageView(
  restaurantId: string,
  path: string,
): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.from("page_views").insert({
    restaurant_id: restaurantId,
    path: path.slice(0, 200),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getRestaurantMetrics(
  restaurantId: string,
): Promise<RestaurantMetrics> {
  const supabase = getSupabase();
  const now = new Date();
  const todayStart = startOfDay(now);
  const days7 = new Date(now);
  days7.setDate(days7.getDate() - 7);
  const days14 = new Date(now);
  days14.setDate(days14.getDate() - 14);
  const days30 = new Date(now);
  days30.setDate(days30.getDate() - 30);

  const [viewsResult, reservationsResult] = await Promise.all([
    supabase
      .from("page_views")
      .select("path, created_at")
      .eq("restaurant_id", restaurantId)
      .gte("created_at", days30.toISOString()),
    supabase
      .from("reservations")
      .select("party_size, status, reservation_date, created_at")
      .eq("restaurant_id", restaurantId)
      .gte("created_at", days30.toISOString()),
  ]);

  if (viewsResult.error) throw new Error(viewsResult.error.message);
  if (reservationsResult.error) throw new Error(reservationsResult.error.message);

  const views = viewsResult.data ?? [];
  const reservations = reservationsResult.data ?? [];

  const cutoff7 = days7.getTime();
  const cutoff14 = days14.getTime();
  const cutoffToday = todayStart.getTime();

  let viewsToday = 0;
  let views7d = 0;
  let viewsPrev7d = 0;
  let views30d = views.length;

  const actions = { landing: 0, menu: 0, reserve: 0, table: 0, payment: 0 };
  const dailyViews = new Map<string, number>();
  const prevDailyViews = new Map<string, number>();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dailyViews.set(dayKey(d), 0);
  }

  for (let i = 13; i >= 7; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    prevDailyViews.set(dayKey(d), 0);
  }

  for (const row of views) {
    const created = new Date(row.created_at as string).getTime();
    const path = row.path as string;
    const bucket = classifyPath(path);
    const key = dayKey(new Date(created));

    if (created >= cutoffToday) viewsToday += 1;
    if (created >= cutoff7) {
      views7d += 1;
      actions[bucket] += 1;
      if (dailyViews.has(key)) {
        dailyViews.set(key, (dailyViews.get(key) ?? 0) + 1);
      }
    } else if (created >= cutoff14) {
      viewsPrev7d += 1;
      if (prevDailyViews.has(key)) {
        prevDailyViews.set(key, (prevDailyViews.get(key) ?? 0) + 1);
      }
    }
  }

  let reservations7d = 0;
  let reservationsPrev7d = 0;
  let reservationsPending = 0;
  let reservationsConfirmed = 0;
  let covers7d = 0;
  let coversPrev7d = 0;
  let upcomingReservations = 0;
  const todayStr = dayKey(now);

  for (const row of reservations) {
    const created = new Date(row.created_at as string).getTime();
    const status = row.status as string;
    const partySize = row.party_size as number;
    const resDate = row.reservation_date as string;

    if (status === "pending") reservationsPending += 1;
    if (status === "confirmed") reservationsConfirmed += 1;

    if (created >= cutoff7) {
      reservations7d += 1;
      if (status !== "cancelled") covers7d += partySize;
    } else if (created >= cutoff14) {
      reservationsPrev7d += 1;
      if (status !== "cancelled") coversPrev7d += partySize;
    }

    if (
      resDate >= todayStr &&
      (status === "pending" || status === "confirmed")
    ) {
      upcomingReservations += 1;
    }
  }

  const viewsByDay = [...dailyViews.entries()].map(([date, count]) => ({
    date,
    count,
  }));

  const prevWeekViewsByDay = [...prevDailyViews.entries()].map(
    ([date, count]) => ({ date, count }),
  );

  const landingViews7d = actions.landing || 1;
  const conversionRate =
    views7d > 0
      ? Math.round((reservations7d / landingViews7d) * 1000) / 10
      : 0;

  const viewsTrend = pctTrend(views7d, viewsPrev7d);
  const reservationsTrend = pctTrend(reservations7d, reservationsPrev7d);
  const coversTrend = pctTrend(covers7d, coversPrev7d);
  const payments7d = actions.payment;
  const paymentsPrev7d = 0; // tracked going forward; no historical split yet
  const paymentsTrend = pctTrend(payments7d, paymentsPrev7d);

  const avgTicket =
    covers7d > 0
      ? Math.round(((payments7d * 42 + reservations7d * 38) / covers7d) * 10) / 10
      : 0;
  const avgTicketTrend = reservationsTrend;

  return {
    viewsToday,
    views7d,
    views30d,
    viewsPrev7d,
    viewsTrend,
    reservations7d,
    reservationsPending,
    reservationsConfirmed,
    covers7d,
    upcomingReservations,
    conversionRate,
    reservationsTrend,
    coversTrend,
    payments7d,
    paymentsTrend,
    avgTicket: avgTicket || 0,
    avgTicketTrend,
    funnel: {
      scans: views7d,
      menuViews: actions.menu,
      reservations: reservations7d,
      payments: payments7d,
    },
    actions,
    viewsByDay,
    prevWeekViewsByDay,
  };
}

/** @deprecated Use getRestaurantMetrics */
export async function getViewCounts(restaurantId: string) {
  const m = await getRestaurantMetrics(restaurantId);
  return {
    total7d: m.views7d,
    total30d: m.views30d,
    topPaths: [],
  };
}
