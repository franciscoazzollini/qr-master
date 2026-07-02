export {
  DEMO_RESTAURANT_ID,
  DEMO_PRIMARY_COLOR,
  DEMO_LOGO_PATH,
  DEMO_EXTERNAL_LINKS,
  DEMO_KITCHEN_WHATSAPP,
  MENU_CATEGORIES,
  MENU_ITEMS,
  CATEGORY_COVER_IMAGES,
} from "./config";

export { getDishImagePath } from "./dish-images";
export type { MenuCategory } from "./config";
export { buildDemoRestaurant } from "./getDemoRestaurant";
export {
  buildTableWhatsAppUrl,
  getDemoTablePath,
  type TableServiceIntent,
} from "./table-service";
