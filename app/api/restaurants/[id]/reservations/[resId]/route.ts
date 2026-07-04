import { NextResponse } from "next/server";
import { authorizeRestaurantAccess } from "@/lib/auth/restaurant-access";
import { updateReservationStatus } from "@/lib/repositories/reservation";
import { getRestaurant } from "@/lib/repositories/restaurant";
import type { ReservationStatus } from "@/lib/types";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string; resId: string }> },
) {
  try {
    const { id, resId } = await context.params;
    const body = (await request.json()) as {
      token?: string;
      status?: ReservationStatus;
    };

    if (!body.status || !["pending", "confirmed", "cancelled"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const restaurant = await getRestaurant(id);
    if (!restaurant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const access = await authorizeRestaurantAccess(restaurant, body.token);
    if (!access.allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reservation = await updateReservationStatus(id, resId, body.status);
    return NextResponse.json({ reservation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
