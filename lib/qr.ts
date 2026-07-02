import QRCode from "qrcode";

export function getRestaurantPublicUrl(id: string, locale = "en"): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/${locale}/r/${id}`;
}

export async function generateQRDataUrl(
  url: string,
  darkMode = true,
): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: darkMode ? "#fafafa" : "#000000",
      light: darkMode ? "#18181b" : "#ffffff",
    },
  });
}
