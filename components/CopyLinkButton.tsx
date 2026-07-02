"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface CopyLinkButtonProps {
  url: string;
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const t = useTranslations("dashboard");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-foreground">{t("publicLink")}</p>
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          className="flex-1 rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"
        >
          {copied ? t("copied") : t("copyLink")}
        </button>
      </div>
    </div>
  );
}
