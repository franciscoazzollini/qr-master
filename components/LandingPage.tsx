"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { PublicRestaurant } from "@/lib/types";
import { LinkButton } from "./LinkButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

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
}

export function LandingPage({ restaurant }: LandingPageProps) {
  const t = useTranslations("links");

  const activeLinks = linkOrder.filter((key) => restaurant.links[key]);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          {restaurant.logoUrl ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md">
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
              className="flex h-24 w-24 items-center justify-center rounded-full text-4xl text-white shadow-md"
              style={{ backgroundColor: restaurant.primaryColor }}
            >
              🍽️
            </div>
          )}
          <h1 className="text-3xl font-bold text-zinc-900">{restaurant.name}</h1>
        </div>

        <div className="flex flex-col gap-3">
          {activeLinks.map((key) => (
            <LinkButton
              key={key}
              linkKey={key}
              href={restaurant.links[key]!}
              label={t(key)}
              primaryColor={restaurant.primaryColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
