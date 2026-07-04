"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { BabLinks, BabSettings, PublicRestaurant, RestaurantTier } from "@/lib/types";
import { BAB_LINK_ORDER } from "@/lib/verticals/config";
import { BAB_DEMO_ID } from "@/lib/bab/demo/config";
import { GuestTopBar } from "@/components/GuestTopBar";
import { BabLinkButton } from "./BabLinkButton";
import { usePageView } from "@/components/usePageView";
import { WiFiConnectButton } from "@/components/WiFiConnectButton";
import { OpeningHoursLine } from "@/components/OpeningHoursLine";

interface BabLandingPageProps {
  venue: PublicRestaurant;
  tagline?: string;
  menuInternalHref?: string;
  reserveHref?: string;
  demoTier?: RestaurantTier;
  showDemoTierSwitch?: boolean;
}

export function BabLandingPage({
  venue,
  tagline,
  menuInternalHref,
  reserveHref,
  demoTier,
  showDemoTierSwitch = false,
}: BabLandingPageProps) {
  const t = useTranslations("bab.links");
  const tRes = useTranslations("reservations");
  const tDemo = useTranslations("bab.demo");
  const tDemoTier = useTranslations("bab.demo.tier");
  const tSettings = useTranslations("bab.settings");

  const links = venue.links as BabLinks;
  const settings = venue.settings as BabSettings;
  const activeLinks = BAB_LINK_ORDER.filter((key) => links[key]);
  const isDemo = venue.id === BAB_DEMO_ID;

  usePageView(venue.id, "/");

  const base = `/bab/g/${venue.id}`;
  const resolvedReserveHref =
    reserveHref ??
    (settings.reservationsEnabled ? `${base}/reserve` : undefined);

  const resolvedMenuHref =
    menuInternalHref ??
    (settings.hostedMenu?.sections?.length ? `${base}/menu` : undefined);

  return (
    <div className="min-h-screen bg-background px-5 pb-10 pt-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        {isDemo ? (
          <Link
            href="/bab"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            ← QR Hub Stay
          </Link>
        ) : null}

        <GuestTopBar showDemoTierSwitch={showDemoTierSwitch} demoVertical="bab" />

        <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
          {venue.logoUrl ? (
            <div className="relative mx-auto h-[min(36vw,8.5rem)] w-[min(36vw,8.5rem)] overflow-hidden rounded-full border-4 border-surface-elevated shadow-md">
              <Image
                src={venue.logoUrl}
                alt={venue.name}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          ) : (
            <div
              className="mx-auto flex h-[min(36vw,8.5rem)] w-[min(36vw,8.5rem)] items-center justify-center rounded-full text-5xl text-white shadow-md"
              style={{ backgroundColor: venue.primaryColor }}
            >
              🏨
            </div>
          )}
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {venue.name}
          </h1>
          {tagline ? (
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              {tagline}
            </p>
          ) : null}
          {settings.checkInOut ? (
            <p className="mt-3 text-xs text-muted">
              Check-in {settings.checkInOut.checkIn} · Check-out{" "}
              {settings.checkInOut.checkOut}
            </p>
          ) : null}
          {settings.receptionHours ? (
            <div className="mt-2">
              <OpeningHoursLine openingHours={settings.receptionHours} />
            </div>
          ) : null}
        </div>

        {settings.breakfastHours ? (
          <div className="rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-center text-sm">
            <span className="font-medium text-foreground">
              {tSettings("breakfastHoursTitle")}
            </span>
            <div className="mt-1">
              <OpeningHoursLine openingHours={settings.breakfastHours} />
            </div>
          </div>
        ) : null}

        {settings.houseRules?.rules?.length ? (
          <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm">
            <p className="font-semibold text-foreground">
              {settings.houseRules.title ?? tSettings("houseRulesTitle")}
            </p>
            <ul className="mt-2 list-inside list-disc text-muted">
              {settings.houseRules.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {settings.serviceGuides?.length ? (
          <div className="flex flex-col gap-2">
            {settings.serviceGuides.map((guide) => (
              <div
                key={guide.id}
                className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
              >
                <p className="font-semibold text-foreground">{guide.title}</p>
                <p className="mt-1 text-muted">{guide.description}</p>
                {guide.link ? (
                  <a
                    href={guide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-accent hover:underline"
                  >
                    {t("localGuide")} →
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          {settings.wifi?.ssid ? (
            <WiFiConnectButton wifi={settings.wifi} primaryColor={venue.primaryColor} />
          ) : null}

          {resolvedReserveHref ? (
            <BabLinkButton
              linkKey="reserve"
              href={resolvedReserveHref}
              label={t("reserve")}
              primaryColor={venue.primaryColor}
              internal
            />
          ) : null}

          {activeLinks.map((key) => {
            const href = links[key]!;
            const isMenuInternal = key === "restaurantMenu" && resolvedMenuHref;

            return (
              <BabLinkButton
                key={key}
                linkKey={key}
                href={isMenuInternal ? resolvedMenuHref : href}
                label={t(key)}
                primaryColor={venue.primaryColor}
                internal={Boolean(isMenuInternal)}
              />
            );
          })}
        </div>

        {isDemo && demoTier === "free" ? (
          <p className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm text-foreground">
            {tDemoTier("guestUpsell")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
