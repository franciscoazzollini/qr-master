import { setRequestLocale } from "next-intl/server";
import { ExampleNewClient } from "@/components/ExampleNewClient";

export default async function NewRestaurantPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExampleNewClient locale={locale} />;
}
