import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <h2
      className={cn(
        "font-sans text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]",
        className
      )}
    >
      {children}
    </h2>
  );
}
