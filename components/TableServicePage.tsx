"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { GuestTopBar } from "@/components/GuestTopBar";
import { buildTableWhatsAppUrl } from "@/lib/table-service";

interface TableServicePageProps {
  tableId: string;
  restaurantId: string;
  restaurantName: string;
  kitchenWhatsApp: string;
  showProBanner?: boolean;
}

const intents = ["order", "waiter", "bill"] as const;

export function TableServicePage({
  tableId,
  restaurantId,
  restaurantName,
  kitchenWhatsApp,
  showProBanner = false,
}: TableServicePageProps) {
  const t = useTranslations("tableService");
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-background px-5 pb-10 pt-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <GuestTopBar />

        {showProBanner ? (
          <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm font-medium text-foreground">
            {t("proBanner")}
          </div>
        ) : null}

        <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">
            {t("tableLabel")}
          </p>
          <h1 className="mt-1 text-4xl font-bold text-foreground">{tableId}</h1>
          <p className="mt-2 text-sm text-muted">{restaurantName}</p>
        </div>

        <div className="flex flex-col gap-3">
          {intents.map((intent) => {
            const href = buildTableWhatsAppUrl(
              tableId,
              locale,
              intent,
              restaurantName,
              kitchenWhatsApp,
            );
            return (
              <a
                key={intent}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[3.75rem] items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-xl">
                  {intent === "order" ? "🍽️" : intent === "waiter" ? "🛎️" : "🧾"}
                </span>
                <span className="flex-1 text-left text-base font-semibold text-foreground">
                  {t(`actions.${intent}`)}
                </span>
                <span className="text-muted">→</span>
              </a>
            );
          })}
        </div>

        <Link
          href={`/r/${restaurantId}`}
          className="text-center text-sm font-medium text-accent hover:underline"
        >
          ← {t("backToRestaurant")}
        </Link>
      </div>
    </div>
  );
}
