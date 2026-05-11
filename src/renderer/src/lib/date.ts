import { format, isToday, isTomorrow, isSameYear, isPast } from "date-fns"
import type { Task } from "@shared/types"

export function formatTaskDue(ts: number | null): string {
  if (ts === null) return ""
  const d = new Date(ts)
  if (isToday(d)) return `Today, ${format(d, "h:mm a")}`
  if (isTomorrow(d)) return `Tomorrow, ${format(d, "h:mm a")}`
  if (isSameYear(d, new Date())) return format(d, "MMM d, h:mm a")
  return format(d, "MMM d, yyyy, h:mm a")
}

export function isOverdue(task: Task): boolean {
  if (task.due_at === null || task.is_done) return false
  return isPast(new Date(task.due_at))
}

export function combineDateAndTime(date: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return new Date(date)
  const result = new Date(date)
  result.setHours(h, m, 0, 0)
  return result
}
