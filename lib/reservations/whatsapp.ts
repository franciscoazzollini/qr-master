import type { Reservation } from "../types";

const NOTIFY_MESSAGES: Record<
  string,
  (r: Reservation, restaurantName: string) => string
> = {
  en: (r, name) =>
    `New reservation at ${name}\n` +
    `Name: ${r.guestName}\n` +
    `Phone: ${r.guestPhone}\n` +
    `Date: ${r.reservationDate}\n` +
    `Time: ${r.reservationTime}\n` +
    `Party: ${r.partySize}` +
    (r.notes ? `\nNotes: ${r.notes}` : ""),
  es: (r, name) =>
    `Nueva reserva en ${name}\n` +
    `Nombre: ${r.guestName}\n` +
    `Teléfono: ${r.guestPhone}\n` +
    `Fecha: ${r.reservationDate}\n` +
    `Hora: ${r.reservationTime}\n` +
    `Personas: ${r.partySize}` +
    (r.notes ? `\nNotas: ${r.notes}` : ""),
};

export function buildReservationNotifyUrl(
  reservation: Reservation,
  restaurantName: string,
  kitchenWhatsApp: string,
  locale = "en",
): string {
  const builder = NOTIFY_MESSAGES[locale] ?? NOTIFY_MESSAGES.en;
  const message = builder(reservation, restaurantName);
  return `https://wa.me/${kitchenWhatsApp}?text=${encodeURIComponent(message)}`;
}
