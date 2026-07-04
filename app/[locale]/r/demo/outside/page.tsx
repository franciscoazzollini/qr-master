import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { DemoOutsideClient } from "@/components/demo/DemoOutsideClient";

export default async function DemoOutsidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <DemoOutsideClient />
    </Suspense>
  );
}
