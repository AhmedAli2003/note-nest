import { Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/cn"
import { IconButton } from "@/components/ui/IconButton"
import { PriorityChip } from "./PriorityChip"
import { formatTaskDue, isOverdue } from "@/lib/date"
import { useTasksStore } from "./store"
import type { Task } from "@shared/types"

interface TaskListItemProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
}

export function TaskListItem({ task, onEdit, onDelete }: TaskListItemProps) {
  const overdue = isOverdue(task)

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer",
        task.is_done && "opacity-60",
        overdue && "border-l-2 border-red-500"
      )}
      onClick={onEdit}
    >
      <input
        type="checkbox"
        checked={task.is_done}
        onChange={() => useTasksStore.getState().toggle(task.id)}
        onClick={(e) => e.stopPropagation()}
        className="h-4 w-4 rounded accent-neutral-900 dark:accent-white focus:ring-neutral-400"
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            task.is_done && "line-through text-neutral-400 dark:text-neutral-500"
          )}
        >
          {task.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <PriorityChip priority={task.priority} />
          {task.due_at !== null && (
            <span className={cn("text-xs", overdue ? "text-red-500" : "text-neutral-400")}>
              {formatTaskDue(task.due_at)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <IconButton aria-label="Edit task" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </IconButton>
        <IconButton aria-label="Delete task" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  )
}
