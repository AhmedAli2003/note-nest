import { useState, useRef, useEffect, useCallback } from "react"
import { DayPicker } from "react-day-picker"
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/cn"
import { formatTaskDue, combineDateAndTime } from "@/lib/date"

interface DateTimePickerProps {
  value: number | null
  onChange: (next: number | null) => void
  placeholder?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "No due date",
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const [localDate, setLocalDate] = useState<Date | null>(
    value !== null ? new Date(value) : null
  )
  const [localTime, setLocalTime] = useState<string>(
    value !== null
      ? `${String(new Date(value).getHours()).padStart(2, "0")}:${String(new Date(value).getMinutes()).padStart(2, "0")}`
      : "12:00"
  )

  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const commit = useCallback(
    (date: Date | null, time: string) => {
      if (date === null) {
        onChange(null)
        return
      }
      onChange(combineDateAndTime(date, time).getTime())
    },
    [onChange]
  )

  useEffect(() => {
    if (value !== null) {
      setLocalDate(new Date(value))
      setLocalTime(
        `${String(new Date(value).getHours()).padStart(2, "0")}:${String(new Date(value).getMinutes()).padStart(2, "0")}`
      )
    } else {
      setLocalDate(null)
      setLocalTime("12:00")
    }
  }, [value])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-10 items-center gap-2 rounded-lg border px-3 text-sm transition-colors",
          "border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300",
          "hover:bg-neutral-50 dark:hover:bg-neutral-800"
        )}
      >
        <CalendarDays className="h-4 w-4" />
        <span className={value !== null ? "" : "text-neutral-400 dark:text-neutral-500"}>
          {value !== null ? formatTaskDue(value) : placeholder}
        </span>
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          className={cn(
            "fixed z-50 rounded-lg border bg-white p-3 shadow-lg",
            "dark:border-neutral-700 dark:bg-neutral-900"
          )}
          style={(() => {
            if (!triggerRef.current) return { left: 0, top: 0 }
            const rect = triggerRef.current.getBoundingClientRect()
            const popH = 420
            const spaceBelow = window.innerHeight - rect.bottom
            const flip = spaceBelow < popH && rect.top > popH
            return {
              left: rect.left,
              top: flip ? rect.top - popH : rect.bottom + 4,
            }
          })()}
        >
          <DayPicker
            mode="single"
            selected={localDate ?? undefined}
            onSelect={(d) => {
              setLocalDate(d ?? null)
              if (d) commit(d, localTime)
              else onChange(null)
            }}
            classNames={{
              today: "text-neutral-900 dark:text-neutral-100 font-semibold",
              selected:
                "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-full",
              chevron:
                "fill-neutral-700 dark:fill-neutral-300",
            }}
          />
          <div className="mt-3 flex items-center gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-700">
            <input
              type="time"
              step="60"
              value={localTime}
              onChange={(e) => {
                setLocalTime(e.target.value)
                if (localDate) commit(localDate, e.target.value)
              }}
              className={cn(
                "h-8 w-full rounded border bg-transparent px-2 text-sm",
                "border-neutral-300 dark:border-neutral-700"
              )}
            />
            <button
              type="button"
              onClick={() => {
                setLocalDate(null)
                setLocalTime("12:00")
                onChange(null)
              }}
              className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
