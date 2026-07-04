import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ReservationForm } from "@/components/ReservationForm";
import { getPublicRestaurant } from "@/lib/repositories/restaurant";

export default async function BabReservePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  setRequestLocale((await params).locale);

  const venue = await getPublicRestaurant(id);
  if (!venue || venue.vertical !== "bab") {
    notFound();
  }

  if (!venue.settings.reservationsEnabled) {
    notFound();
  }

  return (
    <ReservationForm
      restaurantId={id}
      restaurantName={venue.name}
      primaryColor={venue.primaryColor}
      backHref={`/bab/g/${id}`}
    />
  );
}
