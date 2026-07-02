export type WifiPlatform = "ios" | "android" | "other";

export function detectWifiPlatform(): WifiPlatform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

/**
 * Mobile browsers cannot auto-join WiFi networks (iOS blocks it entirely;
 * Android only allows opening system WiFi settings). No http(s) deep link
 * joins WPA networks without a native app or QR scan.
 */
export function getWifiSettingsUrl(platform: WifiPlatform): string | null {
  if (platform === "android") {
    return "intent:#Intent;action=android.settings.WIFI_SETTINGS;end";
  }
  return null;
}

export async function copyWifiPassword(password: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(password);
    return true;
  } catch {
    return false;
  }
}

export async function copyPasswordAndOpenSettings(
  password: string,
  platform: WifiPlatform,
): Promise<"opened" | "copied" | "failed"> {
  const copied = await copyWifiPassword(password);
  if (!copied) return "failed";

  const settingsUrl = getWifiSettingsUrl(platform);
  if (settingsUrl) {
    window.location.href = settingsUrl;
    return "opened";
  }

  return "copied";
}
