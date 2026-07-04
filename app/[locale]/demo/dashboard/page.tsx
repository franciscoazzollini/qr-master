import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { DemoDashboard } from "@/components/DemoDashboard";
import {
  DEMO_EXTERNAL_LINKS,
  DEMO_LOGO_PATH,
  DEMO_PRIMARY_COLOR,
} from "@/lib/demo/config";
import { DEMO_SETTINGS } from "@/lib/demo/settings";
import {
  generateQRDataUrl,
  getAppBaseUrl,
  getOutsidePublicUrl,
  getRestaurantPublicUrl,
  getTablePublicUrl,
} from "@/lib/qr";

const DEMO_TABLES = ["1", "2", "3", "4", "5"];

export default async function DemoDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("demo");

  const publicUrl = getRestaurantPublicUrl("demo", locale);
  const outsidePublicUrl = getOutsidePublicUrl("demo", locale);
  const qrDataUrl = await generateQRDataUrl(publicUrl);
  const outsideQrDataUrl = await generateQRDataUrl(outsidePublicUrl);
  const baseUrl = getAppBaseUrl();

  const tableQRs = await Promise.all(
    DEMO_TABLES.map(async (tableId) => {
      const tableUrl = getTablePublicUrl("demo", tableId, locale);
      const qrDataUrl = await generateQRDataUrl(tableUrl);
      return { tableId, qrDataUrl, tableUrl };
    }),
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
    settings: DEMO_SETTINGS,
  };

  return (
    <Suspense fallback={null}>
      <DemoDashboard
        initialValues={initialValues}
        publicUrl={publicUrl}
        qrDataUrl={qrDataUrl}
        outsidePublicUrl={outsidePublicUrl}
        outsideQrDataUrl={outsideQrDataUrl}
        tableQRs={tableQRs}
      />
    </Suspense>
  );
}
