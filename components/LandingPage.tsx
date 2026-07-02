"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { PublicRestaurant } from "@/lib/types";
import { DEMO_RESTAURANT_ID } from "@/lib/demo/config";
import { AppHeader } from "./AppHeader";
import { LinkButton } from "./LinkButton";

const linkOrder = [
  "menu",
  "googleMaps",
  "instagram",
  "whatsapp",
  "payment",
  "reservation",
] as const;

interface LandingPageProps {
  restaurant: PublicRestaurant;
  tagline?: string;
  menuInternalHref?: string;
}

export function LandingPage({
  restaurant,
  tagline,
  menuInternalHref,
}: LandingPageProps) {
  const t = useTranslations("links");
  const tHome = useTranslations("home");
  const common = useTranslations("common");

  const activeLinks = linkOrder.filter((key) => restaurant.links[key]);
  const isDemo = restaurant.id === DEMO_RESTAURANT_ID;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <AppHeader
          appName={common("appName")}
          tagline={common("tagline")}
        />

        <div className="relative flex flex-col items-center gap-4 text-center">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-40 w-40 rounded-full opacity-30 blur-3xl"
            style={{ backgroundColor: restaurant.primaryColor }}
          />
          {restaurant.logoUrl ? (
            <div className="relative z-10 h-28 w-28 overflow-hidden rounded-full border-4 border-surface shadow-xl ring-2 ring-border">
              <Image
                src={restaurant.logoUrl}
                alt={restaurant.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div
              className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full text-5xl text-white shadow-xl ring-2 ring-border"
              style={{ backgroundColor: restaurant.primaryColor }}
            >
              🍽️
            </div>
          )}
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {restaurant.name}
            </h1>
            {tagline ? (
              <p className="mt-2 text-base text-muted">{tagline}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {activeLinks.map((key) => {
            const href = restaurant.links[key]!;
            const isMenuInternal = key === "menu" && menuInternalHref;

            return (
              <LinkButton
                key={key}
                linkKey={key}
                href={isMenuInternal ? menuInternalHref : href}
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
            className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-border bg-surface-elevated px-4 py-4 text-center transition-colors hover:border-accent/50 hover:bg-surface"
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
