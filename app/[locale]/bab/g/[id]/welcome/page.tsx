import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BabWelcomePage } from "@/components/bab/BabWelcomePage";
import { getRestaurant, enforcePublicVenue } from "@/lib/repositories/restaurant";
import type { BabSettings } from "@/lib/types";

export default async function BabWelcomeRoutePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  setRequestLocale((await params).locale);

  const restaurant = await getRestaurant(id);
  if (!restaurant || restaurant.vertical !== "bab") {
    notFound();
  }

  const venue = enforcePublicVenue(restaurant);
  const settings = venue.settings as BabSettings;
  const steps = settings.venueDirections?.steps ?? [];

  if (!steps.length) {
    notFound();
  }

  return (
    <BabWelcomePage
      venueId={id}
      venueName={venue.name}
      tagline={settings.venueDirections?.title ?? venue.name}
      primaryColor={venue.primaryColor}
      logoUrl={venue.logoUrl}
      hubHref={`/bab/g/${id}`}
      directionsTitle={settings.venueDirections?.title ?? "Directions"}
      directionSteps={steps}
    />
  );
}
