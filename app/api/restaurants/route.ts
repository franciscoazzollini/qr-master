import { NextResponse } from "next/server";
import { createRestaurant } from "@/lib/repositories/restaurant";
import { getSessionUser } from "@/lib/supabase/server";
import { validateCreateInput } from "@/lib/validators";
import type { CreateRestaurantInput } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const body = (await request.json()) as CreateRestaurantInput;
    const validated = validateCreateInput(body);
    const restaurant = await createRestaurant({
      ...validated,
      ownerId: user.id,
    });

    return NextResponse.json({
      id: restaurant.id,
      editToken: restaurant.editToken,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
