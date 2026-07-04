import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { authorizeRestaurantAccess } from "@/lib/auth/restaurant-access";
import {
  getRestaurantMetrics,
  recordPageView,
} from "@/lib/repositories/analytics";
import { getRestaurant } from "@/lib/repositories/restaurant";

const rateLimit = new Map<string, number>();

function getRateLimitKey(restaurantId: string, request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "unknown";
  const ip = forwarded.split(",")[0]?.trim() ?? "unknown";
  return createHash("sha256")
    .update(`${restaurantId}:${ip}`)
    .digest("hex")
    .slice(0, 16);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    const restaurant = await getRestaurant(id);
    if (!restaurant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const access = await authorizeRestaurantAccess(restaurant, token);
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const metrics = await getRestaurantMetrics(id);
    return NextResponse.json(metrics);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { path?: string };
    const path = body.path?.trim() || "/";

    const restaurant = await getRestaurant(id);
    if (!restaurant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const key = getRateLimitKey(id, request);
    const now = Date.now();
    const last = rateLimit.get(key) ?? 0;
    if (now - last < 30_000) {
      return NextResponse.json({ ok: true });
    }
    rateLimit.set(key, now);

    await recordPageView(id, path);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
