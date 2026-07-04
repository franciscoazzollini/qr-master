import type { BabRoomIntent } from "@/lib/types";

export function buildRoomWhatsAppUrl(
  venueName: string,
  roomId: string,
  intent: BabRoomIntent,
  receptionWhatsApp: string,
  locale: string,
): string {
  const labels: Record<BabRoomIntent, Record<string, string>> = {
    roomService: { en: "Room service order", es: "Pedido room service" },
    towels: { en: "Extra towels", es: "Toallas extra" },
    maintenance: { en: "Maintenance request", es: "Mantenimiento" },
    reception: { en: "Contact reception", es: "Contactar recepción" },
    checkout: { en: "Late checkout request", es: "Late checkout" },
  };

  const label = labels[intent][locale] ?? labels[intent].en;
  const message = `[${venueName}] Room ${roomId}: ${label}`;

  return `https://wa.me/${receptionWhatsApp}?text=${encodeURIComponent(message)}`;
}
