import QRCode from "qrcode";

export function getAppBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function getRestaurantPublicUrl(id: string, locale = "en"): string {
  return `${getAppBaseUrl()}/${locale}/r/${id}`;
}

export function getTablePublicUrl(
  restaurantId: string,
  tableId: string,
  locale = "en",
): string {
  return `${getAppBaseUrl()}/${locale}/r/${restaurantId}/table/${tableId}`;
}

export async function generateQRDataUrl(
  url: string,
  darkMode = false,
): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: darkMode ? "#fafafa" : "#1c1917",
      light: darkMode ? "#18181b" : "#fffef9",
    },
  });
}
