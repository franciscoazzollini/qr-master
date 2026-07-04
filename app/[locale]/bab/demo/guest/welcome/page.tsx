import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { BabWelcomePage } from "@/components/bab/BabWelcomePage";
import { BAB_DEMO_SETTINGS } from "@/lib/bab/demo/settings";
import { BAB_DEMO_ID } from "@/lib/bab/demo/config";

export default async function BabDemoWelcomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  setRequestLocale((await params).locale);

  return (
    <Suspense>
      <BabWelcomePage
        venueId={BAB_DEMO_ID}
        venueName="Sea View B&B"
        tagline="Finding us"
        primaryColor="#0d9488"
        logoUrl="/demo/dishes/burrata.jpg"
        hubHref="/bab/demo/guest"
        directionsTitle={BAB_DEMO_SETTINGS.venueDirections?.title ?? "Directions"}
        directionSteps={BAB_DEMO_SETTINGS.venueDirections?.steps ?? []}
        showDemoTierSwitch
      />
    </Suspense>
  );
}
