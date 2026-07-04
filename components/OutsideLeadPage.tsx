"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { GuestTopBar } from "@/components/GuestTopBar";
import { LinkButton } from "@/components/LinkButton";
import { usePageView } from "@/components/usePageView";

interface OutsideLeadPageProps {
  restaurantId: string;
  restaurantName: string;
  tagline: string;
  primaryColor: string;
  logoUrl?: string | null;
  menuHref: string;
  insideHref: string;
  directionsTitle: string;
  directionSteps: string[];
  showDemoTierSwitch?: boolean;
}

export function OutsideLeadPage({
  restaurantId,
  restaurantName,
  tagline,
  primaryColor,
  logoUrl,
  menuHref,
  insideHref,
  directionsTitle,
  directionSteps,
  showDemoTierSwitch = false,
}: OutsideLeadPageProps) {
  const tOutside = useTranslations("demo.outside");

  usePageView(restaurantId, "/outside");

  return (
    <div className="min-h-screen bg-background px-5 pb-10 pt-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <GuestTopBar showDemoTierSwitch={showDemoTierSwitch} />

        <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
          {logoUrl ? (
            <div className="relative mx-auto h-[min(36vw,8.5rem)] w-[min(36vw,8.5rem)] overflow-hidden rounded-full border-4 border-surface-elevated shadow-md">
              <Image
                src={logoUrl}
                alt={restaurantName}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          ) : (
            <div
              className="mx-auto flex h-[min(36vw,8.5rem)] w-[min(36vw,8.5rem)] items-center justify-center rounded-full text-5xl text-white shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              🌅
            </div>
          )}
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {restaurantName}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            {tagline}
          </p>
        </div>

        <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
          <h2 className="text-base font-bold text-foreground">{directionsTitle}</h2>
          <ol className="mt-4 flex flex-col gap-3">
            {directionSteps.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm leading-relaxed text-foreground">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-2">
          <LinkButton
            linkKey="menu"
            href={menuHref}
            label={tOutside("menuCta")}
            primaryColor={primaryColor}
            internal
          />
          <p className="text-center text-xs text-muted">{tOutside("menuHint")}</p>
        </div>

        <Link
          href={insideHref}
          className="text-center text-sm font-medium text-accent hover:underline"
        >
          {tOutside("insideCta")} →
        </Link>
      </div>
    </div>
  );
}
