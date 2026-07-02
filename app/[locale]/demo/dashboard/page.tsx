import { setRequestLocale, getTranslations } from "next-intl/server";
import { DemoDashboard } from "@/components/DemoDashboard";
import {
  DEMO_EXTERNAL_LINKS,
  DEMO_LOGO_PATH,
  DEMO_PRIMARY_COLOR,
} from "@/lib/demo/config";
import { generateQRDataUrl, getRestaurantPublicUrl } from "@/lib/qr";

export default async function DemoDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("demo");

  const publicUrl = getRestaurantPublicUrl("demo", locale);
  const qrDataUrl = await generateQRDataUrl(publicUrl);

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );

  const initialValues = {
    name: t("restaurantName"),
    logoUrl: DEMO_LOGO_PATH,
    primaryColor: DEMO_PRIMARY_COLOR,
    locale,
    links: {
      menu: `${baseUrl}/${locale}/r/demo/menu`,
      ...DEMO_EXTERNAL_LINKS,
    },
  };

  return (
    <DemoDashboard
      initialValues={initialValues}
      publicUrl={publicUrl}
      qrDataUrl={qrDataUrl}
    />
  );
}
