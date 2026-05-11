import type { Task, Priority } from "@shared/types"

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

function dueSortKey(task: Task): number {
  return task.due_at ?? Infinity
}

export function getVisibleTasks(
  tasks: Task[],
  sortBy: "due" | "priority" | "status",
  hideCompleted: boolean
): Task[] {
  let result = tasks
  if (hideCompleted) {
    result = result.filter((t) => !t.is_done)
  }

  const sorted = [...result]

  switch (sortBy) {
    case "due":
      sorted.sort((a, b) => {
        const aDue = dueSortKey(a)
        const bDue = dueSortKey(b)
        if (aDue !== bDue) return aDue - bDue
        return b.created_at - a.created_at
      })
      break
    case "priority":
      sorted.sort((a, b) => {
        const aP = PRIORITY_ORDER[a.priority]
        const bP = PRIORITY_ORDER[b.priority]
        if (aP !== bP) return aP - bP
        const aDue = dueSortKey(a)
        const bDue = dueSortKey(b)
        return aDue - bDue
      })
      break
    case "status":
      sorted.sort((a, b) => {
        if (a.is_done !== b.is_done) return a.is_done ? 1 : -1
        const aDue = dueSortKey(a)
        const bDue = dueSortKey(b)
        return aDue - bDue
      })
      break
  }

  return sorted
}
