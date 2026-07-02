export type TableServiceIntent = "order" | "waiter" | "bill";

const INTENT_MESSAGES: Record<
  TableServiceIntent,
  Record<string, (tableId: string, restaurantName: string) => string>
> = {
  order: {
    en: (table, name) => `Table ${table} | ${name} | Order: `,
    es: (table, name) => `Mesa ${table} | ${name} | Pedido: `,
    ar: (table, name) => `طاولة ${table} | ${name} | طلب: `,
  },
  waiter: {
    en: (table, name) => `Table ${table} | ${name} | Call waiter`,
    es: (table, name) => `Mesa ${table} | ${name} | Llamar camarero`,
    ar: (table, name) => `طاولة ${table} | ${name} | طلب النادل`,
  },
  bill: {
    en: (table, name) => `Table ${table} | ${name} | Request bill`,
    es: (table, name) => `Mesa ${table} | ${name} | Pedir la cuenta`,
    ar: (table, name) => `طاولة ${table} | ${name} | طلب الفاتورة`,
  },
};

function getMessage(
  intent: TableServiceIntent,
  tableId: string,
  restaurantName: string,
  locale: string,
): string {
  const byLocale = INTENT_MESSAGES[intent];
  const builder = byLocale[locale] ?? byLocale.en;
  return builder(tableId, restaurantName);
}

export function buildTableWhatsAppUrl(
  tableId: string,
  locale: string,
  intent: TableServiceIntent,
  restaurantName: string,
  kitchenWhatsApp: string,
): string {
  const message = getMessage(intent, tableId, restaurantName, locale);
  return `https://wa.me/${kitchenWhatsApp}?text=${encodeURIComponent(message)}`;
}

export function getTablePath(restaurantId: string, tableId: string): string {
  return `/r/${restaurantId}/table/${tableId}`;
}
