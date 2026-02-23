import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-[var(--text-muted)] selection:bg-[var(--accent)] selection:text-[var(--text-inverse)] border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-primary)] w-full min-w-0 min-h-[80px] rounded-md border px-3 py-2.5 text-base transition-[color,box-shadow] duration-200 outline-none resize-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[var(--accent)] focus-visible:ring-[3px] focus-visible:ring-[var(--accent-muted)]",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
