import QRCode from "qrcode";
import { getAppBaseUrl } from "../qr";

export function getBabGuestUrl(id: string, locale = "en"): string {
  return `${getAppBaseUrl()}/${locale}/bab/g/${id}`;
}

export function getBabWelcomeUrl(id: string, locale = "en"): string {
  return `${getAppBaseUrl()}/${locale}/bab/g/${id}/welcome`;
}

export function getBabRoomUrl(
  venueId: string,
  roomId: string,
  locale = "en",
): string {
  return `${getAppBaseUrl()}/${locale}/bab/g/${venueId}/room/${roomId}`;
}

export async function generateBabQRDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: "#1c1917", light: "#fffef9" },
  });
}
