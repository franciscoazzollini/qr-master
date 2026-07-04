import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { redirect as i18nRedirect } from "@/i18n/routing";
import { DashboardClient } from "./DashboardClient";
import { authorizeRestaurantAccess } from "@/lib/auth/restaurant-access";
import { enforceTierOnLinks } from "@/lib/tier-enforcement";
import {
  generateQRDataUrl,
  getOutsidePublicUrl,
  getRestaurantPublicUrl,
  getTablePublicUrl,
} from "@/lib/qr";
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

  const restaurant = await getRestaurant(id);
  if (!restaurant) {
    notFound();
  }

  const access = await authorizeRestaurantAccess(restaurant, token);
  if (!access.allowed) {
    const t = await getTranslations("errors");
    if (!token) {
      i18nRedirect({ href: "/login", locale });
    }
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-center text-destructive">{t("forbidden")}</p>
      </div>
    );
  }

  const publicPath = restaurant.slug ?? restaurant.id;
  const publicUrl = getRestaurantPublicUrl(publicPath, restaurant.locale);
  const outsidePublicUrl = getOutsidePublicUrl(publicPath, locale);
  const qrDataUrl = await generateQRDataUrl(publicUrl);
  const outsideQrDataUrl = await generateQRDataUrl(outsidePublicUrl);

  const tableCount = restaurant.settings.tableCount ?? 0;
  const tableQRs = await Promise.all(
    Array.from({ length: tableCount }, (_, i) => String(i + 1)).map(
      async (tableId) => {
        const tableUrl = getTablePublicUrl(restaurant.id, tableId, locale);
        const tableQrDataUrl = await generateQRDataUrl(tableUrl);
        return { tableId, qrDataUrl: tableQrDataUrl, tableUrl };
      },
    ),
  );

  const tierLinks = enforceTierOnLinks(restaurant.tier, restaurant.links);

  return (
    <DashboardClient
      restaurantId={restaurant.id}
      tier={restaurant.tier}
      token={token}
      useSessionAuth={access.via === "session"}
      publicUrl={publicUrl}
      outsidePublicUrl={outsidePublicUrl}
      qrDataUrl={qrDataUrl}
      outsideQrDataUrl={outsideQrDataUrl}
      tableQRs={tableQRs}
      initialSettings={restaurant.settings}
      initialValues={{
        name: restaurant.name,
        logoUrl: restaurant.logoUrl ?? "",
        primaryColor: restaurant.primaryColor,
        locale: restaurant.locale,
        links: {
          menu: tierLinks.menu ?? "",
          googleMaps: tierLinks.googleMaps ?? "",
          instagram: tierLinks.instagram ?? "",
          whatsapp: tierLinks.whatsapp ?? "",
          payment: tierLinks.payment ?? "",
          tip: tierLinks.tip ?? "",
        },
        settings: restaurant.settings,
      }}
    />
  );
}
