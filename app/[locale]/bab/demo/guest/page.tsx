import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { BabDemoLandingClient } from "@/components/bab/demo/BabDemoLandingClient";

export default async function BabDemoGuestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <BabDemoLandingClient />
    </Suspense>
  );
}
