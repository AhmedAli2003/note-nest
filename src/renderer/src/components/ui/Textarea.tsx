import { cn } from "@/lib/cn"
import { forwardRef, type TextareaHTMLAttributes } from "react"

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-none bg-transparent p-4 text-base leading-relaxed text-neutral-900 dark:text-neutral-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
        className
      )}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"
