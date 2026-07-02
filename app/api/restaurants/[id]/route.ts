import { NextResponse } from "next/server";
import {
  getPublicRestaurant,
  getRestaurant,
  updateRestaurant,
} from "@/lib/repositories/restaurant";
import { validateUpdateInput } from "@/lib/validators";
import type { UpdateRestaurantInput } from "@/lib/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const restaurant = await getPublicRestaurant(id);

    if (!restaurant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateRestaurantInput & {
      token?: string;
    };

    const { token, ...updates } = body;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 403 });
    }

    const existing = await getRestaurant(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.editToken !== token) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validated = validateUpdateInput(updates);
    const restaurant = await updateRestaurant(id, validated);

    return NextResponse.json({
      id: restaurant.id,
      name: restaurant.name,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
