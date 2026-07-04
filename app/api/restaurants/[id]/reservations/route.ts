import { NextResponse } from "next/server";
import { authorizeRestaurantAccess } from "@/lib/auth/restaurant-access";
import {
  createReservation,
  listReservations,
} from "@/lib/repositories/reservation";
import { getRestaurant } from "@/lib/repositories/restaurant";
import { buildReservationNotifyUrl } from "@/lib/reservations/whatsapp";
import { validateCreateReservationInput } from "@/lib/validators";
import type { CreateReservationInput } from "@/lib/types";

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

    const reservations = await listReservations(id);
    return NextResponse.json({ reservations });
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
    const body = (await request.json()) as CreateReservationInput;

    const restaurant = await getRestaurant(id);
    if (!restaurant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!restaurant.settings.reservationsEnabled) {
      return NextResponse.json(
        { error: "Reservations are not enabled" },
        { status: 403 },
      );
    }

    const validated = validateCreateReservationInput(body);
    const reservation = await createReservation(id, validated);

    let whatsappNotifyUrl: string | undefined;
    if (restaurant.settings.kitchenWhatsApp) {
      whatsappNotifyUrl = buildReservationNotifyUrl(
        reservation,
        restaurant.name,
        restaurant.settings.kitchenWhatsApp,
        restaurant.locale,
      );
    }

    return NextResponse.json({ reservation, whatsappNotifyUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
