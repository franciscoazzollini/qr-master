import type { AllergenId, HostedMenu } from "../types";
import { getDishImagePath } from "../demo/dish-images";
import { CATEGORY_COVER_IMAGES, MENU_CATEGORIES, MENU_ITEMS } from "../demo/config";

export const DEMO_ITEM_ALLERGENS: Record<string, AllergenId[]> = {
  burrata: ["dairy"],
  carpaccio: ["dairy"],
  paella: ["shellfish", "fish"],
  salmon: ["fish"],
  ribeye: [],
  tiramisu: ["dairy", "eggs", "gluten"],
  "panna-cotta": ["dairy"],
  cheesecake: ["dairy", "eggs", "gluten"],
  sangria: [],
  espresso: [],
};

export function buildHostedMenuTemplate(
  translations?: {
    categories: Record<string, { title: string; subtitle: string }>;
    items: Record<
      string,
      { name: string; description: string; price: string; tag?: string }
    >;
  },
): HostedMenu {
  const defaults = {
    categories: {
      mains: {
        title: "Starters & Mains",
        subtitle: "From shared plates to signature mains",
      },
      desserts: {
        title: "Desserts & Drinks",
        subtitle: "Sweet finishes and terrace cocktails",
      },
    },
    items: {
      burrata: {
        name: "Heirloom Tomato Burrata",
        description: "Creamy burrata, basil oil, aged balsamic",
        price: "€14",
        tag: "Vegetarian",
      },
      carpaccio: {
        name: "Beef Carpaccio",
        description: "Thin-sliced beef, rocket, parmesan, truffle dressing",
        price: "€16",
      },
      paella: {
        name: "Valencian Paella",
        description: "Saffron rice, prawns, mussels, chicken",
        price: "€24",
        tag: "Chef's choice",
      },
      salmon: {
        name: "Grilled Atlantic Salmon",
        description: "Lemon butter, charred broccolini, herb potatoes",
        price: "€22",
      },
      ribeye: {
        name: "Charred Ribeye",
        description: "300g ribeye, chimichurri, patatas bravas",
        price: "€32",
      },
      tiramisu: {
        name: "Classic Tiramisu",
        description: "Espresso-soaked ladyfingers, mascarpone, cocoa",
        price: "€9",
      },
      "panna-cotta": {
        name: "Vanilla Panna Cotta",
        description: "Berry compote, almond brittle",
        price: "€8",
        tag: "Gluten-free",
      },
      cheesecake: {
        name: "Baked Cheesecake",
        description: "San Sebastian style, caramel sauce",
        price: "€10",
      },
      sangria: {
        name: "Terrace Sangria",
        description: "Red wine, citrus, seasonal fruit",
        price: "€8",
      },
      espresso: {
        name: "Double Espresso",
        description: "Single-origin blend",
        price: "€3",
      },
    },
  };

  const t = translations ?? defaults;
  const items = t.items as Record<
    string,
    { name: string; description: string; price: string; tag?: string }
  >;

  return {
    sections: MENU_CATEGORIES.map((categoryId) => ({
      id: categoryId,
      title: t.categories[categoryId].title,
      subtitle: t.categories[categoryId].subtitle,
      coverImage: CATEGORY_COVER_IMAGES[categoryId],
      items: MENU_ITEMS[categoryId].map((itemId) => ({
        id: itemId,
        name: items[itemId].name,
        description: items[itemId].description,
        price: items[itemId].price,
        imageSrc: getDishImagePath(itemId),
        tag: items[itemId].tag || undefined,
        allergens: DEMO_ITEM_ALLERGENS[itemId] ?? [],
      })),
    })),
  };
}

export function itemHasAllergen(
  itemAllergens: AllergenId[] | undefined,
  selected: AllergenId[],
): boolean {
  if (!selected.length || !itemAllergens?.length) return false;
  return selected.some((a) => itemAllergens.includes(a));
}
