import { CheckCircle2, XCircle, Info, X } from "lucide-react"
import { useToastStore } from "@/stores/toasts"
import { cn } from "@/lib/cn"

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const colorMap = {
  success: "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  error: "border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200",
  info: "border-neutral-500 bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
}

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2"
    >
      {toasts.map((t) => {
        const Icon = iconMap[t.kind]
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg",
              colorMap[t.kind]
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-0.5 hover:opacity-70"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
