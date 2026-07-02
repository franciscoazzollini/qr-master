import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { TableServicePage } from "@/components/TableServicePage";
import { DEMO_KITCHEN_WHATSAPP, DEMO_RESTAURANT_ID } from "@/lib/demo/config";
import { buildDemoRestaurant } from "@/lib/demo/getDemoRestaurant";
import { getPublicRestaurant } from "@/lib/repositories/restaurant";

export default async function TableServiceRoute({
  params,
}: {
  params: Promise<{ locale: string; id: string; tableId: string }>;
}) {
  const { locale, id, tableId } = await params;
  setRequestLocale(locale);

  if (id === DEMO_RESTAURANT_ID) {
    const restaurant = buildDemoRestaurant({
      name: "La Terraza",
      menuInternalPath: "/r/demo/menu",
    });
    return (
      <TableServicePage
        tableId={tableId}
        restaurantId={id}
        restaurantName={restaurant.name}
        kitchenWhatsApp={DEMO_KITCHEN_WHATSAPP}
        showProBanner
      />
    );
  }

  const restaurant = await getPublicRestaurant(id);
  if (!restaurant) {
    notFound();
  }

  const kitchenWhatsApp = restaurant.settings.kitchenWhatsApp;
  if (!kitchenWhatsApp) {
    notFound();
  }

  const tableCount = restaurant.settings.tableCount ?? 0;
  const tableNum = Number(tableId);
  if (!Number.isInteger(tableNum) || tableNum < 1 || tableNum > tableCount) {
    notFound();
  }

  return (
    <TableServicePage
      tableId={tableId}
      restaurantId={id}
      restaurantName={restaurant.name}
      kitchenWhatsApp={kitchenWhatsApp}
    />
  );
}
