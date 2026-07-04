"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { GuestTopBar } from "@/components/GuestTopBar";
import { usePageView } from "@/components/usePageView";
import { buildRoomWhatsAppUrl } from "@/lib/bab/room-service";
import type { BabRoomIntent } from "@/lib/types";

interface RoomServicePageProps {
  roomId: string;
  venueId: string;
  venueName: string;
  receptionWhatsApp: string;
  showProBanner?: boolean;
}

const intents: BabRoomIntent[] = [
  "roomService",
  "towels",
  "maintenance",
  "reception",
  "checkout",
];

export function RoomServicePage({
  roomId,
  venueId,
  venueName,
  receptionWhatsApp,
  showProBanner = false,
}: RoomServicePageProps) {
  const t = useTranslations("bab.roomService");
  const locale = useLocale();

  usePageView(venueId, `/room/${roomId}`);

  return (
    <div className="min-h-screen bg-background px-5 pb-10 pt-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Link
          href={`/bab/g/${venueId}`}
          className="text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          ← {t("backToHub")}
        </Link>

        <GuestTopBar />

        {showProBanner ? (
          <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm font-medium text-foreground">
            {t("proBanner")}
          </div>
        ) : null}

        <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">
            {t("roomLabel")}
          </p>
          <h1 className="mt-1 text-4xl font-bold text-foreground">{roomId}</h1>
          <p className="mt-2 text-sm text-muted">{venueName}</p>
        </div>

        <div className="flex flex-col gap-3">
          {intents.map((intent) => {
            const href = buildRoomWhatsAppUrl(
              venueName,
              roomId,
              intent,
              receptionWhatsApp,
              locale,
            );

            return (
              <a
                key={intent}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[3.75rem] items-center justify-center rounded-2xl border border-border bg-surface px-4 py-3 text-base font-semibold text-foreground shadow-sm transition-all hover:border-accent/40 hover:shadow-md active:scale-[0.99]"
              >
                {t(intent)}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
