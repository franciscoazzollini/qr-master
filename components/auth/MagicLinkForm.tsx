"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface MagicLinkFormProps {
  redirectPath?: string;
  submitLabel?: string;
}

export function MagicLinkForm({
  redirectPath,
  submitLabel,
}: MagicLinkFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const next = redirectPath ?? `/${locale}/account`;
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-4 text-sm text-foreground">
        <p className="font-semibold">{t("checkEmailTitle")}</p>
        <p className="mt-2 text-muted">{t("checkEmailBody", { email })}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">{t("email")}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("emailPlaceholder")}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-accent"
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
        className="rounded-2xl bg-accent px-6 py-4 text-lg font-semibold text-accent-foreground transition-opacity disabled:opacity-60"
      >
        {loading ? t("sending") : (submitLabel ?? t("sendMagicLink"))}
      </button>

      <p className="text-center text-xs text-muted">{t("magicLinkHint")}</p>
    </form>
  );
}
