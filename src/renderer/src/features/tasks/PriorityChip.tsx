import { cn } from "@/lib/cn"
import type { Priority } from "@shared/types"

const chipBase =
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize"

const chipColors: Record<Priority, { text: string; bg: string }> = {
  high: { text: "text-priority-high", bg: "bg-priority-high/10" },
  medium: { text: "text-priority-medium", bg: "bg-priority-medium/10" },
  low: { text: "text-priority-low", bg: "bg-priority-low/10" },
}

interface DisplayProps {
  mode?: "display"
  priority: Priority
}

interface SelectProps {
  mode: "select"
  value: Priority
  onChange: (next: Priority) => void
}

type Props = DisplayProps | SelectProps

export function PriorityChip(props: Props) {
  if (props.mode === "select") {
    const { value, onChange } = props
    const priorities: Priority[] = ["high", "medium", "low"]
    return (
      <div className="flex gap-1">
        {priorities.map((p) => {
          const isActive = p === value
          const colors = chipColors[p]
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={cn(
                chipBase,
                isActive
                  ? `${colors.text} ${colors.bg}`
                  : "text-neutral-400 bg-neutral-100 dark:text-neutral-500 dark:bg-neutral-800"
              )}
            >
              {p}
            </button>
          )
        })}
      </div>
    )
  }

  const { priority } = props
  const colors = chipColors[priority]
  return <span className={cn(chipBase, colors.text, colors.bg)}>{priority}</span>
}
