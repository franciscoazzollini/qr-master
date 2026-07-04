import { setRequestLocale } from "next-intl/server";
import { getSessionUser } from "@/lib/supabase/server";
import { BabNewClient } from "@/components/bab/BabNewClient";

export default async function BabNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getSessionUser();

  return <BabNewClient locale={locale} isAuthenticated={Boolean(user)} />;
}
