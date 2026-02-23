import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[var(--text-primary)] placeholder:text-[var(--text-muted)] selection:bg-[var(--accent)] selection:text-[var(--text-inverse)] border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-primary)] h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-normal disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[var(--accent)] focus-visible:ring-[3px] focus-visible:ring-[var(--accent-muted)]",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
