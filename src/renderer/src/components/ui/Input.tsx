import { cn } from "@/lib/cn"
import { type InputHTMLAttributes, forwardRef } from "react"

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-lg border bg-transparent px-3 text-sm",
          "border-neutral-300 text-neutral-900 placeholder-neutral-400",
          "dark:border-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
