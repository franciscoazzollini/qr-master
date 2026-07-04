import { setRequestLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { BabDemoDashboard } from "@/components/bab/demo/BabDemoDashboard";
import { generateBabQRDataUrl, getBabGuestUrl, getBabWelcomeUrl, getBabRoomUrl } from "@/lib/bab/qr";

export default async function BabDemoDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bab.demo");

  const lobbyUrl = getBabGuestUrl("bab-demo", locale);
  const welcomeUrl = getBabWelcomeUrl("bab-demo", locale);
  const lobbyQr = await generateBabQRDataUrl(lobbyUrl);
  const welcomeQr = await generateBabQRDataUrl(welcomeUrl);

  const roomQRs = await Promise.all(
    ["1", "2", "3"].map(async (roomId) => {
      const roomUrl = getBabRoomUrl("bab-demo", roomId, locale);
      return {
        roomId,
        roomUrl,
        qrDataUrl: await generateBabQRDataUrl(roomUrl),
      };
    }),
  );

  return (
    <Suspense>
      <BabDemoDashboard
        propertyName={t("propertyName")}
        lobbyUrl={lobbyUrl}
        welcomeUrl={welcomeUrl}
        lobbyQrDataUrl={lobbyQr}
        welcomeQrDataUrl={welcomeQr}
        roomQRs={roomQRs}
      />
    </Suspense>
  );
}
