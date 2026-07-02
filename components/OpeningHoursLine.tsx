"use client";

import { useTranslations } from "next-intl";
import { formatHoursRange, getTodayHours, isOpenNow } from "@/lib/opening-hours";
import type { RestaurantSettings } from "@/lib/types";

interface OpeningHoursLineProps {
  openingHours: NonNullable<RestaurantSettings["openingHours"]>;
}

export function OpeningHoursLine({ openingHours }: OpeningHoursLineProps) {
  const t = useTranslations("openingHours");
  const today = getTodayHours(openingHours);
  const open = isOpenNow(openingHours);

  if (today === undefined) return null;

  return (
    <p className="text-center text-sm text-muted">
      {today === null ? (
        <span>{t("closedToday")}</span>
      ) : (
        <>
          <span
            className={
              open === true
                ? "font-medium text-success"
                : open === false
                  ? "text-muted"
                  : ""
            }
          >
            {open === true ? t("openNow") : open === false ? t("closedNow") : t("today")}
          </span>
          {" · "}
          {formatHoursRange(today)}
        </>
      )}
    </p>
  );
}
