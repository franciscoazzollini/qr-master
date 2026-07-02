import { Link } from "@/i18n/routing";
import type { LinkKey } from "@/lib/types";

const linkIcons: Record<LinkKey, string> = {
  menu: "📋",
  googleMaps: "⭐",
  instagram: "📸",
  whatsapp: "💬",
  payment: "💳",
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
    "flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-[0.98]";
  const style = {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
  };

  const content = (
    <>
      <span className="text-2xl" aria-hidden>
        {linkIcons[linkKey]}
      </span>
      <span>{label}</span>
    </>
  );

  if (internal || href.startsWith("/")) {
    return (
      <Link href={href} className={className} style={style}>
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
      style={style}
    >
      {content}
    </a>
  );
}
