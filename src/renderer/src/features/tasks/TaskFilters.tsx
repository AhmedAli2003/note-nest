import { cn } from "@/lib/cn"
import { useTasksStore } from "./store"

const sortOptions = [
  { key: "due" as const, label: "Due" },
  { key: "priority" as const, label: "Priority" },
  { key: "status" as const, label: "Status" },
]

export function TaskFilters() {
  const sortBy = useTasksStore((s) => s.sortBy)
  const hideCompleted = useTasksStore((s) => s.hideCompleted)
  const setSortBy = useTasksStore((s) => s.setSortBy)
  const setHideCompleted = useTasksStore((s) => s.setHideCompleted)

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">Sort by</span>
        <div className="flex gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSortBy(opt.key)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                sortBy === opt.key
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-transparent text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        <input
          type="checkbox"
          checked={hideCompleted}
          onChange={(e) => setHideCompleted(e.target.checked)}
          className="h-3.5 w-3.5 rounded accent-neutral-900 dark:accent-white"
        />
        Hide completed
      </label>
    </div>
  )
}
