interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 shadow-sm ${
        hover ? "transition-colors hover:border-accent/40 hover:bg-surface-elevated" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
