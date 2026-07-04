import { nanoid } from "nanoid";
import { getSupabase } from "../supabase";
import {
  enforceTierOnLinks,
  enforceTierOnSettings,
  normalizeSlug,
} from "../tier-enforcement";
import {
  enforceBabTierOnLinks,
  enforceBabTierOnSettings,
  mergeBabSettings,
} from "../bab/validators";
import { mergeSettings } from "../validators";
import type {
  BabLinks,
  BabSettings,
  PublicRestaurant,
  Restaurant,
  RestaurantLinks,
  RestaurantSettings,
  UpdateRestaurantInput,
  VenueVertical,
} from "../types";

interface RestaurantRow {
  id: string;
  slug: string | null;
  name: string;
  logo_url: string | null;
  primary_color: string;
  locale: string;
  links: Restaurant["links"];
  settings: RestaurantSettings | BabSettings | null;
  edit_token: string;
  owner_id: string | null;
  tier: Restaurant["tier"];
  vertical: VenueVertical;
  created_at: string;
  updated_at: string;
}

function mapRow(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logoUrl: row.logo_url,
    primaryColor: row.primary_color,
    locale: row.locale,
    links: row.links ?? {},
    settings: row.settings ?? {},
    editToken: row.edit_token,
    ownerId: row.owner_id,
    tier: row.tier,
    vertical: row.vertical ?? "restaurant",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function enforcePublicVenue(restaurant: Restaurant): PublicRestaurant {
  const base = {
    id: restaurant.id,
    name: restaurant.name,
    logoUrl: restaurant.logoUrl,
    primaryColor: restaurant.primaryColor,
    locale: restaurant.locale,
    tier: restaurant.tier,
    vertical: restaurant.vertical,
  };

  if (restaurant.vertical === "bab") {
    return {
      ...base,
      links: enforceBabTierOnLinks(
        restaurant.tier,
        restaurant.links as BabLinks,
      ),
      settings: enforceBabTierOnSettings(
        restaurant.tier,
        restaurant.settings as BabSettings,
      ),
    };
  }

  return {
    ...base,
    links: enforceTierOnLinks(restaurant.tier, restaurant.links as RestaurantLinks),
    settings: enforceTierOnSettings(
      restaurant.tier,
      restaurant.settings as RestaurantSettings,
    ),
  };
}

function toPublic(restaurant: Restaurant): PublicRestaurant {
  return enforcePublicVenue(restaurant);
}

export async function createRestaurant(input: {
  name: string;
  slug?: string;
  logoUrl: string | null;
  primaryColor: string;
  locale: string;
  links: Restaurant["links"];
  settings?: Restaurant["settings"];
  ownerId: string;
  vertical?: VenueVertical;
}): Promise<Restaurant> {
  const supabase = getSupabase();
  const slug = input.slug ? normalizeSlug(input.slug) : undefined;
  const id = slug ?? nanoid(10);
  const editToken = nanoid(32);
  const tier = "free" as const;
  const vertical = input.vertical ?? "restaurant";

  const links =
    vertical === "bab"
      ? enforceBabTierOnLinks(tier, input.links as BabLinks)
      : enforceTierOnLinks(tier, input.links as RestaurantLinks);

  const settings =
    vertical === "bab"
      ? enforceBabTierOnSettings(tier, (input.settings ?? {}) as BabSettings)
      : enforceTierOnSettings(tier, (input.settings ?? {}) as RestaurantSettings);

  const { data, error } = await supabase
    .from("restaurants")
    .insert({
      id,
      slug: slug ?? null,
      name: input.name,
      logo_url: input.logoUrl,
      primary_color: input.primaryColor,
      locale: input.locale,
      links,
      settings,
      edit_token: editToken,
      owner_id: input.ownerId,
      tier,
      vertical,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data as RestaurantRow);
}

export async function getRestaurant(idOrSlug: string): Promise<Restaurant | null> {
  const supabase = getSupabase();

  const { data: byId, error: idError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", idOrSlug)
    .maybeSingle();

  if (idError) {
    throw new Error(idError.message);
  }

  if (byId) {
    return mapRow(byId as RestaurantRow);
  }

  const { data: bySlug, error: slugError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", idOrSlug)
    .maybeSingle();

  if (slugError) {
    throw new Error(slugError.message);
  }

  if (!bySlug) return null;
  return mapRow(bySlug as RestaurantRow);
}

export async function getPublicRestaurant(
  idOrSlug: string,
): Promise<PublicRestaurant | null> {
  const restaurant = await getRestaurant(idOrSlug);
  if (!restaurant) return null;
  return toPublic(restaurant);
}

export async function listRestaurantsByOwner(
  ownerId: string,
): Promise<Restaurant[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapRow(row as RestaurantRow));
}

export async function updateRestaurant(
  id: string,
  input: UpdateRestaurantInput,
  existing?: Restaurant,
): Promise<Restaurant> {
  const supabase = getSupabase();
  const current = existing ?? (await getRestaurant(id));
  if (!current) {
    throw new Error("Restaurant not found");
  }

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) payload.name = input.name;
  if (input.logoUrl !== undefined) payload.logo_url = input.logoUrl;
  if (input.primaryColor !== undefined) payload.primary_color = input.primaryColor;
  if (input.locale !== undefined) payload.locale = input.locale;

  if (input.links !== undefined) {
    payload.links =
      current.vertical === "bab"
        ? enforceBabTierOnLinks(current.tier, input.links as BabLinks)
        : enforceTierOnLinks(current.tier, input.links as RestaurantLinks);
  }

  if (input.settings !== undefined) {
    const merged =
      current.vertical === "bab"
        ? mergeBabSettings(
            (current.settings ?? {}) as BabSettings,
            input.settings as BabSettings,
          )
        : mergeSettings(
            (current.settings ?? {}) as RestaurantSettings,
            input.settings as RestaurantSettings,
          );

    payload.settings =
      current.vertical === "bab"
        ? enforceBabTierOnSettings(current.tier, merged as BabSettings)
        : enforceTierOnSettings(current.tier, merged);
  }

  const { data, error } = await supabase
    .from("restaurants")
    .update(payload)
    .eq("id", current.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data as RestaurantRow);
}

export { enforcePublicVenue };
