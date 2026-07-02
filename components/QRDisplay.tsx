"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface QRDisplayProps {
  dataUrl: string;
  restaurantName: string;
}

export function QRDisplay({ dataUrl, restaurantName }: QRDisplayProps) {
  const t = useTranslations("dashboard");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${restaurantName.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
      <Image
        src={dataUrl}
        alt={t("qrTitle")}
        width={256}
        height={256}
        unoptimized
        className="rounded-xl"
      />
      <button
        type="button"
        onClick={handleDownload}
        className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
      >
        {t("downloadQr")}
      </button>
    </div>
  );
}
