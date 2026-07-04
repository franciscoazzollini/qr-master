import { getTranslations, setRequestLocale } from "next-intl/server";
import { TableServicePage } from "@/components/TableServicePage";
import { DEMO_KITCHEN_WHATSAPP, DEMO_RESTAURANT_ID } from "@/lib/demo/config";
import { buildDemoRestaurant } from "@/lib/demo/getDemoRestaurant";

export default async function DemoTablePage({
  params,
}: {
  params: Promise<{ locale: string; tableId: string }>;
}) {
  const { locale, tableId } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("demo");
  const restaurant = buildDemoRestaurant({
    name: t("restaurantName"),
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
