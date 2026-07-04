import { setRequestLocale } from "next-intl/server";
import { NewRestaurantClient } from "@/components/NewRestaurantClient";
import { getSessionUser } from "@/lib/supabase/server";

export default async function NewRestaurantPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSessionUser();

  return (
    <NewRestaurantClient locale={locale} isAuthenticated={Boolean(user)} />
  );
}
