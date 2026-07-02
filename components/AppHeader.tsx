import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

interface AppHeaderProps {
  appName?: string;
  tagline?: string;
  backHref?: string;
  backLabel?: string;
}

export function AppHeader({
  appName = "QR Hub",
  tagline,
  backHref,
  backLabel,
}: AppHeaderProps) {
  return (
    <header className="flex w-full items-center justify-between gap-4">
      <div className="min-w-0">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-1 block text-sm text-muted transition-colors hover:text-foreground"
          >
            ← {backLabel}
          </Link>
        ) : null}
        <Link href="/" className="block truncate">
          <p className="text-lg font-bold text-foreground">{appName}</p>
          {tagline ? (
            <p className="truncate text-sm text-muted">{tagline}</p>
          ) : null}
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
