const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric"
})

export function formatRelativeTime(ts: number): string {
  const now = Date.now()
  const diffMs = ts - now
  const absSec = Math.abs(diffMs) / 1000

  if (absSec < 60) return "just now"

  const absMin = absSec / 60
  if (absMin < 60) return formatter.format(Math.round(diffMs / 60000), "minute")

  const absH = absMin / 60
  if (absH < 24) return formatter.format(Math.round(diffMs / 3600000), "hour")

  const absD = absH / 24
  if (absD < 7) return formatter.format(Math.round(diffMs / 86400000), "day")

  return dateFormatter.format(ts)
}
