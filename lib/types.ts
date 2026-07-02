export type RestaurantTier = "free" | "pro";

export interface RestaurantLinks {
  menu?: string;
  googleMaps?: string;
  instagram?: string;
  whatsapp?: string;
  payment?: string;
  reservation?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logoUrl?: string | null;
  primaryColor: string;
  locale: string;
  links: RestaurantLinks;
  editToken: string;
  tier: RestaurantTier;
  createdAt: string;
  updatedAt: string;
}

export interface PublicRestaurant {
  id: string;
  name: string;
  logoUrl?: string | null;
  primaryColor: string;
  locale: string;
  links: RestaurantLinks;
  tier: RestaurantTier;
}

export interface CreateRestaurantInput {
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  locale?: string;
  links?: RestaurantLinks;
}

export interface UpdateRestaurantInput {
  name?: string;
  logoUrl?: string | null;
  primaryColor?: string;
  locale?: string;
  links?: RestaurantLinks;
}

export type LinkKey = keyof RestaurantLinks;
