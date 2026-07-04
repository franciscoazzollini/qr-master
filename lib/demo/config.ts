export const DEMO_RESTAURANT_ID = "demo";

export const DEMO_PRIMARY_COLOR = "#e07a3a";

export const DEMO_LOGO_PATH = "/demo/logo.jpg";

export const DEMO_EXTERNAL_LINKS = {
  googleMaps:
    "https://maps.google.com/?q=D+Sunset+Beach+Restaurant",
  instagram: "https://instagram.com",
  whatsapp: "https://wa.me/34600000000",
  payment: "https://stripe.com",
  tip: "https://buy.stripe.com/test_tip",
} as const;

export const DEMO_KITCHEN_WHATSAPP = "34600000000";

export const MENU_CATEGORIES = ["mains", "desserts"] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export const MENU_ITEMS: Record<MenuCategory, string[]> = {
  mains: ["burrata", "carpaccio", "paella", "salmon", "ribeye"],
  desserts: ["tiramisu", "panna-cotta", "cheesecake", "sangria", "espresso"],
};

export const CATEGORY_COVER_IMAGES: Record<MenuCategory, string> = {
  mains: "/demo/dishes/category-mains.jpg",
  desserts: "/demo/dishes/category-desserts.jpg",
};
