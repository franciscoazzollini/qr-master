import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { redirect as i18nRedirect } from "@/i18n/routing";
import { BabDashboardClient } from "@/components/bab/BabDashboardClient";
import { authorizeRestaurantAccess } from "@/lib/auth/restaurant-access";
import {
  generateBabQRDataUrl,
  getBabGuestUrl,
  getBabRoomUrl,
  getBabWelcomeUrl,
} from "@/lib/bab/qr";
import { enforceBabTierOnLinks } from "@/lib/bab/validators";
import { getRestaurant } from "@/lib/repositories/restaurant";
import type { BabLinks, BabSettings } from "@/lib/types";

export default async function BabDashboardPage({
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
  if (!restaurant || restaurant.vertical !== "bab") {
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
        <p className="text-destructive">{t("forbidden")}</p>
      </div>
    );
  }

  const publicPath = restaurant.slug ?? restaurant.id;
  const lobbyUrl = getBabGuestUrl(publicPath, locale);
  const welcomeUrl = getBabWelcomeUrl(publicPath, locale);
  const lobbyQrDataUrl = await generateBabQRDataUrl(lobbyUrl);
  const welcomeQrDataUrl = await generateBabQRDataUrl(welcomeUrl);

  const settings = restaurant.settings as BabSettings;
  const roomCount = settings.roomCount ?? 0;
  const roomQRs = await Promise.all(
    Array.from({ length: roomCount }, (_, i) => String(i + 1)).map(
      async (roomId) => {
        const roomUrl = getBabRoomUrl(restaurant.id, roomId, locale);
        return {
          roomId,
          roomUrl,
          qrDataUrl: await generateBabQRDataUrl(roomUrl),
        };
      },
    ),
  );

  const tierLinks = enforceBabTierOnLinks(
    restaurant.tier,
    restaurant.links as BabLinks,
  );

  return (
    <BabDashboardClient
      venueId={restaurant.id}
      tier={restaurant.tier}
      token={token}
      lobbyUrl={lobbyUrl}
      welcomeUrl={welcomeUrl}
      lobbyQrDataUrl={lobbyQrDataUrl}
      welcomeQrDataUrl={welcomeQrDataUrl}
      roomQRs={roomQRs}
      initialSettings={settings}
      initialValues={{
        name: restaurant.name,
        logoUrl: restaurant.logoUrl ?? "",
        primaryColor: restaurant.primaryColor,
        locale: restaurant.locale,
        links: {
          booking: tierLinks.booking ?? "",
          googleMaps: tierLinks.googleMaps ?? "",
          instagram: tierLinks.instagram ?? "",
          whatsapp: tierLinks.whatsapp ?? "",
          restaurantMenu: tierLinks.restaurantMenu ?? "",
          spa: tierLinks.spa ?? "",
          parking: tierLinks.parking ?? "",
          localGuide: tierLinks.localGuide ?? "",
          review: tierLinks.review ?? "",
          emergency: tierLinks.emergency ?? "",
        },
        settings,
      }}
    />
  );
}
