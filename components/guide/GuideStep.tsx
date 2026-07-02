interface GuideStepProps {
  step: number;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function GuideStep({ step, title, description, children }: GuideStepProps) {
  return (
    <section className="flex gap-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
        {step}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="mt-2 text-muted leading-relaxed">{description}</p>
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </section>
  );
}

interface GuideMockupProps {
  title: string;
  children: React.ReactNode;
}

export function GuideMockup({ title, children }: GuideMockupProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border bg-surface-elevated px-4 py-2 text-xs font-medium text-muted">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

interface GuideProCardProps {
  title: string;
  description: string;
  badge?: string;
}

export function GuideProCard({ title, description, badge }: GuideProCardProps) {
  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
      {badge ? (
        <span className="mb-2 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
          {badge}
        </span>
      ) : null}
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
