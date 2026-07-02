import { nanoid } from "nanoid";
import { getSupabase } from "../supabase";
import type {
  PublicRestaurant,
  Restaurant,
  UpdateRestaurantInput,
} from "../types";

interface RestaurantRow {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string;
  locale: string;
  links: Restaurant["links"];
  edit_token: string;
  tier: Restaurant["tier"];
  created_at: string;
  updated_at: string;
}

function mapRow(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    primaryColor: row.primary_color,
    locale: row.locale,
    links: row.links ?? {},
    editToken: row.edit_token,
    tier: row.tier,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toPublic(restaurant: Restaurant): PublicRestaurant {
  return {
    id: restaurant.id,
    name: restaurant.name,
    logoUrl: restaurant.logoUrl,
    primaryColor: restaurant.primaryColor,
    locale: restaurant.locale,
    links: restaurant.links,
    tier: restaurant.tier,
  };
}

export async function createRestaurant(input: {
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  locale: string;
  links: Restaurant["links"];
}): Promise<Restaurant> {
  const supabase = getSupabase();
  const id = nanoid(10);
  const editToken = nanoid(32);

  const { data, error } = await supabase
    .from("restaurants")
    .insert({
      id,
      name: input.name,
      logo_url: input.logoUrl,
      primary_color: input.primaryColor,
      locale: input.locale,
      links: input.links,
      edit_token: editToken,
      tier: "free",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data as RestaurantRow);
}

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;
  return mapRow(data as RestaurantRow);
}

export async function getPublicRestaurant(
  id: string,
): Promise<PublicRestaurant | null> {
  const restaurant = await getRestaurant(id);
  if (!restaurant) return null;
  return toPublic(restaurant);
}

export async function updateRestaurant(
  id: string,
  input: UpdateRestaurantInput,
): Promise<Restaurant> {
  const supabase = getSupabase();

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) payload.name = input.name;
  if (input.logoUrl !== undefined) payload.logo_url = input.logoUrl;
  if (input.primaryColor !== undefined) payload.primary_color = input.primaryColor;
  if (input.locale !== undefined) payload.locale = input.locale;
  if (input.links !== undefined) payload.links = input.links;

  const { data, error } = await supabase
    .from("restaurants")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data as RestaurantRow);
}
