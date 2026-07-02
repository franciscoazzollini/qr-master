import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DashboardClient } from "./DashboardClient";
import { generateQRDataUrl, getRestaurantPublicUrl, getTablePublicUrl } from "@/lib/qr";
import { getRestaurant } from "@/lib/repositories/restaurant";

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale, id } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);

  if (!token) {
    const t = await getTranslations("errors");
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-center text-destructive">{t("forbidden")}</p>
      </div>
    );
  }

  const restaurant = await getRestaurant(id);
  if (!restaurant) {
    notFound();
  }

  if (restaurant.editToken !== token) {
    const t = await getTranslations("errors");
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-center text-destructive">{t("forbidden")}</p>
      </div>
    );
  }

  const publicUrl = getRestaurantPublicUrl(id, restaurant.locale);
  const qrDataUrl = await generateQRDataUrl(publicUrl);

  const tableCount = restaurant.settings.tableCount ?? 0;
  const tableQRs = await Promise.all(
    Array.from({ length: tableCount }, (_, i) => String(i + 1)).map(
      async (tableId) => {
        const tableUrl = getTablePublicUrl(id, tableId, locale);
        const tableQrDataUrl = await generateQRDataUrl(tableUrl);
        return { tableId, qrDataUrl: tableQrDataUrl, tableUrl };
      },
    ),
  );

  return (
    <DashboardClient
      restaurantId={id}
      token={token}
      publicUrl={publicUrl}
      qrDataUrl={qrDataUrl}
      tableQRs={tableQRs}
      initialSettings={restaurant.settings}
      initialValues={{
        name: restaurant.name,
        logoUrl: restaurant.logoUrl ?? "",
        primaryColor: restaurant.primaryColor,
        locale: restaurant.locale,
        links: {
          menu: restaurant.links.menu ?? "",
          googleMaps: restaurant.links.googleMaps ?? "",
          instagram: restaurant.links.instagram ?? "",
          whatsapp: restaurant.links.whatsapp ?? "",
          payment: restaurant.links.payment ?? "",
          tip: restaurant.links.tip ?? "",
        },
        settings: restaurant.settings,
      }}
    />
  );
}
