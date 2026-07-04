"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Reservation, ReservationStatus } from "@/lib/types";

interface ReservationsListProps {
  restaurantId: string;
  token?: string;
}

export function ReservationsList({
  restaurantId,
  token,
}: ReservationsListProps) {
  const t = useTranslations("reservations");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const query = token ? `?token=${encodeURIComponent(token)}` : "";
    const response = await fetch(
      `/api/restaurants/${restaurantId}/reservations${query}`,
      { credentials: "include" },
    );
    const data = await response.json();
    if (response.ok) {
      setReservations(data.reservations ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [restaurantId, token]);

  const updateStatus = async (resId: string, status: ReservationStatus) => {
    await fetch(`/api/restaurants/${restaurantId}/reservations/${resId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...(token ? { token } : {}),
        status,
      }),
    });
    load();
  };

  if (loading) {
    return <p className="text-sm text-muted">{t("loading")}</p>;
  }

  if (!reservations.length) {
    return <p className="text-sm text-muted">{t("empty")}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reservations.map((r) => (
        <div
          key={r.id}
          className="rounded-xl border border-border bg-surface-elevated p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">{r.guestName}</p>
              <p className="text-sm text-muted">
                {r.reservationDate} · {r.reservationTime} · {r.partySize}{" "}
                {t("guests")}
              </p>
              <p className="text-sm text-muted">{r.guestPhone}</p>
              {r.notes ? (
                <p className="mt-1 text-sm text-muted">{r.notes}</p>
              ) : null}
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                r.status === "confirmed"
                  ? "bg-success/15 text-success"
                  : r.status === "cancelled"
                    ? "bg-destructive/15 text-destructive"
                    : "bg-accent/15 text-accent"
              }`}
            >
              {t(`status.${r.status}`)}
            </span>
          </div>
          {r.status === "pending" ? (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => updateStatus(r.id, "confirmed")}
                className="rounded-lg bg-success/15 px-3 py-1.5 text-xs font-semibold text-success"
              >
                {t("confirm")}
              </button>
              <button
                type="button"
                onClick={() => updateStatus(r.id, "cancelled")}
                className="rounded-lg bg-destructive/15 px-3 py-1.5 text-xs font-semibold text-destructive"
              >
                {t("cancel")}
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
