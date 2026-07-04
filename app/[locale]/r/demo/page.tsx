import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { DemoLandingClient } from "@/components/demo/DemoLandingClient";

export default async function DemoLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <DemoLandingClient />
    </Suspense>
  );
}
