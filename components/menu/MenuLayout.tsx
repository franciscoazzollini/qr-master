import Image from "next/image";
import { Link } from "@/i18n/routing";
import { AppHeader } from "@/components/AppHeader";

interface MenuLayoutProps {
  restaurantName: string;
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}

export function MenuLayout({
  restaurantName,
  title,
  subtitle,
  backHref,
  backLabel,
  children,
}: MenuLayoutProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <AppHeader backHref={backHref} backLabel={backLabel} />
        <div>
          <p className="text-sm font-medium text-muted">{restaurantName}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-base text-muted">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}

interface MenuCategoryCardProps {
  href: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  cta: string;
}

export function MenuCategoryCard({
  href,
  title,
  subtitle,
  imageSrc,
  cta,
}: MenuCategoryCardProps) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:border-accent/40 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-white/80">{subtitle}</p>
          <p className="mt-3 text-sm font-semibold text-white/90">{cta} →</p>
        </div>
      </div>
    </Link>
  );
}

interface MenuItemCardProps {
  name: string;
  description: string;
  price: string;
  imageSrc: string;
  tag?: string;
}

export function MenuItemCard({
  name,
  description,
  price,
  imageSrc,
  tag,
}: MenuItemCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm">
          {price}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          {tag ? (
            <span className="shrink-0 rounded-full bg-surface-elevated px-2 py-0.5 text-xs font-medium text-muted">
              {tag}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </article>
  );
}
