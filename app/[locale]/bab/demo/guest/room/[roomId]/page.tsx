import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { RoomServicePage } from "@/components/bab/RoomServicePage";
import { BAB_DEMO_ID, BAB_DEMO_RECEPTION_WHATSAPP } from "@/lib/bab/demo/config";

export default async function BabDemoRoomPage({
  params,
}: {
  params: Promise<{ locale: string; roomId: string }>;
}) {
  const { roomId } = await params;
  setRequestLocale((await params).locale);

  return (
    <Suspense>
      <RoomServicePage
        roomId={roomId}
        venueId={BAB_DEMO_ID}
        venueName="Sea View B&B"
        receptionWhatsApp={BAB_DEMO_RECEPTION_WHATSAPP}
        showProBanner
      />
    </Suspense>
  );
}
