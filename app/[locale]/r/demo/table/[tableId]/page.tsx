import { setRequestLocale } from "next-intl/server";
import { TableServicePage } from "@/components/TableServicePage";
import { DEMO_KITCHEN_WHATSAPP, DEMO_RESTAURANT_ID } from "@/lib/demo/config";
import { buildDemoRestaurant } from "@/lib/demo/getDemoRestaurant";

export default async function DemoTablePage({
  params,
}: {
  params: Promise<{ locale: string; tableId: string }>;
}) {
  const { tableId } = await params;
  setRequestLocale((await params).locale);

  const restaurant = buildDemoRestaurant({
    name: "La Terraza",
    menuInternalPath: "/r/demo/menu",
  });

  return (
    <TableServicePage
      tableId={tableId}
      restaurantId={DEMO_RESTAURANT_ID}
      restaurantName={restaurant.name}
      kitchenWhatsApp={DEMO_KITCHEN_WHATSAPP}
      showProBanner
    />
  );
}
