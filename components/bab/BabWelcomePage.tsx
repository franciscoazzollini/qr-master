"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { GuestTopBar } from "@/components/GuestTopBar";
import { BabLinkButton } from "./BabLinkButton";
import { usePageView } from "@/components/usePageView";

interface BabWelcomePageProps {
  venueId: string;
  venueName: string;
  tagline: string;
  primaryColor: string;
  logoUrl?: string | null;
  hubHref: string;
  directionsTitle: string;
  directionSteps: string[];
  showDemoTierSwitch?: boolean;
}

export function BabWelcomePage({
  venueId,
  venueName,
  tagline,
  primaryColor,
  logoUrl,
  hubHref,
  directionsTitle,
  directionSteps,
  showDemoTierSwitch = false,
}: BabWelcomePageProps) {
  const t = useTranslations("bab.welcome");

  usePageView(venueId, "/welcome");

  return (
    <div className="min-h-screen bg-background px-5 pb-10 pt-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Link
          href={hubHref}
          className="text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          ← {t("backToHub")}
        </Link>

        <GuestTopBar showDemoTierSwitch={showDemoTierSwitch} demoVertical="bab" />

        <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
          {logoUrl ? (
            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-surface-elevated shadow-md">
              <Image
                src={logoUrl}
                alt={venueName}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          ) : (
            <div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full text-4xl text-white shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              🏨
            </div>
          )}
          <h1 className="mt-4 text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted">{tagline}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold text-foreground">{directionsTitle}</h2>
          <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5 text-sm text-muted">
            {directionSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <BabLinkButton
          linkKey="booking"
          href={hubHref}
          label={t("hubCta")}
          primaryColor={primaryColor}
          internal
        />
      </div>
    </div>
  );
}
