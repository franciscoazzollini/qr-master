import { Link } from "@/i18n/routing";
import type { LinkKey } from "@/lib/types";

const linkIcons: Record<LinkKey, string> = {
  menu: "📋",
  googleMaps: "⭐",
  instagram: "📸",
  whatsapp: "💬",
  payment: "💳",
  tip: "🙏",
  reservation: "📅",
};

interface LinkButtonProps {
  linkKey: LinkKey;
  href: string;
  label: string;
  primaryColor: string;
  internal?: boolean;
}

export function LinkButton({
  linkKey,
  href,
  label,
  primaryColor,
  internal = false,
}: LinkButtonProps) {
  const className =
    "flex min-h-[3.75rem] w-full items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3 text-left shadow-sm transition-all active:scale-[0.99] hover:shadow-md";

  const content = (
    <>
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
        style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}
        aria-hidden
      >
        {linkIcons[linkKey]}
      </span>
      <span
        className="min-w-0 flex-1 text-base font-semibold text-foreground"
        style={{ borderLeft: `3px solid ${primaryColor}`, paddingLeft: "0.75rem" }}
      >
        {label}
      </span>
      <span className="shrink-0 text-muted" aria-hidden>
        →
      </span>
    </>
  );

  if (internal || href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  );
}
