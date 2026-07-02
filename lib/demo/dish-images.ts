/**
 * Curated Pexels photo slugs matched to each dish/drink.
 * Run: node scripts/fetch-dish-images.mjs
 */
export const DISH_IMAGE_SOURCES = {
  burrata: { file: "burrata.jpg", pexels: "1435904", query: "caprese mozzarella tomato" },
  carpaccio: { file: "carpaccio.jpg", pexels: "361184", query: "beef steak carpaccio" },
  paella: { file: "paella.jpg", pexels: "5560763", query: "paella seafood rice" },
  salmon: { file: "salmon.jpg", pexels: "46239", query: "grilled salmon" },
  ribeye: { file: "ribeye.jpg", pexels: "3535383", query: "ribeye steak" },
  tiramisu: { file: "tiramisu.jpg", pexels: "6880219", query: "tiramisu dessert" },
  "panna-cotta": { file: "panna-cotta.jpg", pexels: "1126359", query: "panna cotta dessert" },
  cheesecake: { file: "cheesecake.jpg", pexels: "291528", query: "cheesecake dessert" },
  sangria: { file: "sangria.jpg", pexels: "1283219", query: "sangria drink" },
  espresso: { file: "espresso.jpg", pexels: "302899", query: "espresso coffee" },
  "category-mains": { file: "category-mains.jpg", pexels: "1640777", query: "healthy food spread" },
  "category-desserts": { file: "category-desserts.jpg", pexels: "4553622", query: "desserts pastries" },
} as const;

export type DishImageKey = keyof typeof DISH_IMAGE_SOURCES;

export function getDishImagePath(itemId: string): string {
  const source = DISH_IMAGE_SOURCES[itemId as DishImageKey];
  if (source) {
    return `/demo/dishes/${source.file}`;
  }
  return `/demo/dishes/${itemId}.jpg`;
}
