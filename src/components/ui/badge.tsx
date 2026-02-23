import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 font-sans text-xs font-medium uppercase tracking-[0.05em] w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface-muted)] text-[var(--text-primary)] border-transparent",
        secondary:
          "bg-[var(--surface-subtle)] text-[var(--text-secondary)] border-transparent",
        destructive:
          "bg-red-900/30 text-red-400 border-transparent",
        outline:
          "border-[var(--border-default)] text-[var(--text-primary)] bg-transparent",
        ghost: "border-transparent bg-transparent text-[var(--text-secondary)]",
        success: "bg-emerald-900/30 text-emerald-400 border-emerald-800/30",
        warning: "bg-amber-900/30 text-amber-400 border-amber-800/30",
        error: "bg-red-900/30 text-red-400 border-red-800/30",
        completed: "bg-emerald-900/30 text-emerald-400 border-emerald-800/30",
        failed: "bg-red-900/30 text-red-400 border-red-800/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
