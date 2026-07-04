"use client";

import { useTranslations } from "next-intl";
import { BabLandingPage } from "@/components/bab/BabLandingPage";
import { buildBabDemoVenue } from "@/lib/bab/demo/getBabDemo";
import { useBabDemoTier } from "./BabDemoTierSwitch";

export function BabDemoLandingClient() {
  const tier = useBabDemoTier();
  const t = useTranslations("bab.demo");

  const venue = buildBabDemoVenue({
    name: t("propertyName"),
    tagline: t("propertyTagline"),
    tier,
  });

  return (
    <BabLandingPage
      venue={venue}
      tagline={t("propertyTagline")}
      menuInternalHref={tier === "pro" ? "/bab/demo/guest/menu" : undefined}
      demoTier={tier}
      showDemoTierSwitch
    />
  );
}
