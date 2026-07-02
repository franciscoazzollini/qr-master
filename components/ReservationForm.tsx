"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { DEMO_RESTAURANT_ID } from "@/lib/demo/config";

interface ReservationFormProps {
  restaurantId: string;
  restaurantName: string;
  primaryColor: string;
  backHref: string;
}

export function ReservationForm({
  restaurantId,
  restaurantName,
  primaryColor,
  backHref,
}: ReservationFormProps) {
  const t = useTranslations("reservations");
  const tCommon = useTranslations("common");

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [whatsappNotifyUrl, setWhatsappNotifyUrl] = useState<string | null>(
    null,
  );

  const inputClass =
    "rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (restaurantId === DEMO_RESTAURANT_ID) {
        setSuccess(true);
        setWhatsappNotifyUrl(
          `https://wa.me/34600000000?text=${encodeURIComponent(
            `Demo reservation: ${guestName}, ${reservationDate} ${reservationTime}, party ${partySize}`,
          )}`,
        );
        return;
      }

      const response = await fetch(
        `/api/restaurants/${restaurantId}/reservations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guestName,
            guestPhone,
            reservationDate,
            reservationTime,
            partySize,
            notes: notes || undefined,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? t("error"));
      }

      setSuccess(true);
      if (data.whatsappNotifyUrl) {
        setWhatsappNotifyUrl(data.whatsappNotifyUrl);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : t("error"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background px-5 pb-10 pt-6">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
          <GuestTopBar />
          <div className="rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
            <span className="text-4xl">✅</span>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              {t("successTitle")}
            </h1>
            <p className="mt-2 text-sm text-muted">{t("successMessage")}</p>
            {whatsappNotifyUrl ? (
              <a
                href={whatsappNotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[3rem] w-full items-center justify-center rounded-2xl bg-[#25D366] px-4 py-3 text-base font-semibold text-white"
              >
                {t("notifyWhatsApp")}
              </a>
            ) : null}
            <Link
              href={backHref}
              className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              ← {t("backToRestaurant")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-5 pb-10 pt-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <GuestTopBar />

        <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm font-medium text-muted">{restaurantName}</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("name")}</span>
            <input
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("phone")}</span>
            <input
              required
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className={inputClass}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t("date")}</span>
              <input
                required
                type="date"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t("time")}</span>
              <input
                required
                type="time"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("partySize")}</span>
            <select
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className={inputClass}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t("notes")}</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder={t("notesPlaceholder")}
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl px-6 py-4 text-lg font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? tCommon("saving") : t("submit")}
          </button>
        </form>

        <Link
          href={backHref}
          className="text-center text-sm font-medium text-accent hover:underline"
        >
          ← {t("backToRestaurant")}
        </Link>
      </div>
    </div>
  );
}
