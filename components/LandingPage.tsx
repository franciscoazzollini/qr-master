"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { PublicRestaurant } from "@/lib/types";
import { DEMO_RESTAURANT_ID } from "@/lib/demo/config";
import { GuestTopBar } from "./GuestTopBar";
import { LinkButton } from "./LinkButton";
import { usePageView } from "@/components/usePageView";
import { WiFiCard } from "./WiFiCard";
import { DailySpecialBanner } from "./DailySpecialBanner";
import { OpeningHoursLine } from "./OpeningHoursLine";

const linkOrder = [
  "menu",
  "googleMaps",
  "instagram",
  "whatsapp",
  "payment",
  "tip",
] as const;

interface LandingPageProps {
  restaurant: PublicRestaurant;
  tagline?: string;
  menuInternalHref?: string;
  reserveHref?: string;
  dailySpecialProLabel?: string;
}

export function LandingPage({
  restaurant,
  tagline,
  menuInternalHref,
  reserveHref,
  dailySpecialProLabel,
}: LandingPageProps) {
  const t = useTranslations("links");
  const tHome = useTranslations("home");
  const tRes = useTranslations("reservations");

  const activeLinks = linkOrder.filter((key) => restaurant.links[key]);
  const isDemo = restaurant.id === DEMO_RESTAURANT_ID;
  const { settings } = restaurant;
  const showReserve =
    reserveHref ||
    (settings.reservationsEnabled && !isDemo) ||
    (isDemo && settings.reservationsEnabled !== false);

  usePageView(restaurant.id, "/");

  const resolvedReserveHref =
    reserveHref ?? (showReserve ? `/r/${restaurant.id}/reserve` : undefined);

  const resolvedMenuHref =
    menuInternalHref ??
    (settings.hostedMenu?.sections?.length
      ? `/r/${restaurant.id}/menu`
      : undefined);

  return (
    <div className="min-h-screen bg-background px-5 pb-10 pt-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <GuestTopBar />

        <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
          {restaurant.logoUrl ? (
            <div className="relative mx-auto h-[min(36vw,8.5rem)] w-[min(36vw,8.5rem)] overflow-hidden rounded-full border-4 border-surface-elevated shadow-md">
              <Image
                src={restaurant.logoUrl}
                alt={restaurant.name}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          ) : (
            <div
              className="mx-auto flex h-[min(36vw,8.5rem)] w-[min(36vw,8.5rem)] items-center justify-center rounded-full text-5xl text-white shadow-md"
              style={{ backgroundColor: restaurant.primaryColor }}
            >
              🍽️
            </div>
          )}
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {restaurant.name}
          </h1>
          {tagline ? (
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              {tagline}
            </p>
          ) : null}
          {settings.openingHours ? (
            <div className="mt-3">
              <OpeningHoursLine openingHours={settings.openingHours} />
            </div>
          ) : null}
        </div>

        {settings.dailySpecial?.active ? (
          <DailySpecialBanner
            special={settings.dailySpecial}
            primaryColor={restaurant.primaryColor}
            proLabel={dailySpecialProLabel}
          />
        ) : null}

        {settings.wifi?.ssid ? (
          <WiFiCard wifi={settings.wifi} primaryColor={restaurant.primaryColor} />
        ) : null}

        <div className="flex flex-col gap-3">
          {resolvedReserveHref ? (
            <LinkButton
              linkKey="reserve"
              href={resolvedReserveHref}
              label={tRes("reserveButton")}
              primaryColor={restaurant.primaryColor}
              internal
            />
          ) : null}

          {activeLinks.map((key) => {
            const href = restaurant.links[key]!;
            const isMenuInternal = key === "menu" && resolvedMenuHref;

            return (
              <LinkButton
                key={key}
                linkKey={key}
                href={isMenuInternal ? resolvedMenuHref : href}
                label={t(key)}
                primaryColor={restaurant.primaryColor}
                internal={Boolean(isMenuInternal)}
              />
            );
          })}
        </div>

        {!isDemo ? (
          <Link
            href="/r/demo"
            className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border bg-surface-elevated px-4 py-4 text-center transition-colors hover:border-accent/40"
          >
            <span className="text-sm font-semibold text-foreground">
              {tHome("examplePageCta")}
            </span>
            <span className="text-xs text-muted">{tHome("examplePageHint")}</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
