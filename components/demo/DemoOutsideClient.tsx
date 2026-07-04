"use client";

import { useTranslations } from "next-intl";
import { OutsideLeadPage } from "@/components/OutsideLeadPage";
import { DEMO_LOGO_PATH, DEMO_PRIMARY_COLOR } from "@/lib/demo/config";

export function DemoOutsideClient() {
  const t = useTranslations("demo");
  const tOutside = useTranslations("demo.outside");

  const directionSteps = [
    tOutside("step1"),
    tOutside("step2"),
    tOutside("step3"),
    tOutside("step4"),
  ];

  return (
    <OutsideLeadPage
      restaurantId="demo"
      restaurantName={t("restaurantName")}
      tagline={tOutside("subtitle")}
      primaryColor={DEMO_PRIMARY_COLOR}
      logoUrl={DEMO_LOGO_PATH}
      menuHref="/r/demo/menu"
      insideHref="/r/demo"
      directionsTitle={tOutside("directionsTitle")}
      directionSteps={directionSteps}
      showDemoTierSwitch
    />
  );
}
