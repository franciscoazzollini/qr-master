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
}

export function LinkButton({
  linkKey,
  href,
  label,
  primaryColor,
}: LinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 px-6 py-4 text-lg font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
      style={{
        backgroundColor: primaryColor,
        borderColor: primaryColor,
      }}
    >
      <span className="text-2xl" aria-hidden>
        {linkIcons[linkKey]}
      </span>
      <span>{label}</span>
    </a>
  );
}
