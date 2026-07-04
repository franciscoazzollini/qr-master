import type { Restaurant } from "@/lib/types";
import { getSessionUser } from "@/lib/supabase/server";

export type RestaurantAccessResult =
  | { allowed: true; via: "token" | "session" }
  | { allowed: false };

export function tokenGrantsAccess(
  restaurant: Restaurant,
  token: string | null | undefined,
): boolean {
  return Boolean(token && token === restaurant.editToken);
}

export function sessionGrantsAccess(
  restaurant: Restaurant,
  userId: string | null | undefined,
): boolean {
  return Boolean(
    userId && restaurant.ownerId && restaurant.ownerId === userId,
  );
}

export async function authorizeRestaurantAccess(
  restaurant: Restaurant,
  token?: string | null,
): Promise<RestaurantAccessResult> {
  if (tokenGrantsAccess(restaurant, token)) {
    return { allowed: true, via: "token" };
  }

  const user = await getSessionUser();
  if (sessionGrantsAccess(restaurant, user?.id)) {
    return { allowed: true, via: "session" };
  }

  return { allowed: false };
}
