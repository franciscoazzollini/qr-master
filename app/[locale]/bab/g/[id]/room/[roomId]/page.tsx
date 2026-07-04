import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { RoomServicePage } from "@/components/bab/RoomServicePage";
import { getRestaurant, enforcePublicVenue } from "@/lib/repositories/restaurant";
import type { BabSettings } from "@/lib/types";

export default async function BabRoomPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; roomId: string }>;
}) {
  const { id, roomId } = await params;
  setRequestLocale((await params).locale);

  const restaurant = await getRestaurant(id);
  if (!restaurant || restaurant.vertical !== "bab") {
    notFound();
  }

  if (restaurant.tier !== "pro") {
    notFound();
  }

  const venue = enforcePublicVenue(restaurant);
  const settings = venue.settings as BabSettings;
  const receptionWhatsApp = settings.receptionWhatsApp;

  if (!receptionWhatsApp) {
    notFound();
  }

  return (
    <RoomServicePage
      roomId={roomId}
      venueId={id}
      venueName={venue.name}
      receptionWhatsApp={receptionWhatsApp}
    />
  );
}
