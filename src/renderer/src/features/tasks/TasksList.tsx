import { useState } from "react"
import { CheckSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { TaskListItem } from "./TaskListItem"
import { TaskFormDialog } from "./TaskFormDialog"
import { TaskFilters } from "./TaskFilters"
import { getVisibleTasks } from "./sort"
import { useTasksStore } from "./store"
import type { Task } from "@shared/types"

type DialogState =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; task: Task }

export function TasksList() {
  const tasks = useTasksStore((s) => s.tasks)
  const sortBy = useTasksStore((s) => s.sortBy)
  const hideCompleted = useTasksStore((s) => s.hideCompleted)
  const isLoaded = useTasksStore((s) => s.isLoaded)

  const [dialog, setDialog] = useState<DialogState>({ kind: "closed" })
  const [deleting, setDeleting] = useState<Task | null>(null)

  if (!isLoaded) return null

  const visible = getVisibleTasks(tasks, sortBy, hideCompleted)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <TaskFilters />
        <Button size="sm" onClick={() => setDialog({ kind: "create" })}>
          <Plus className="mr-1 h-4 w-4" />
          New task
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tasks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
            <CheckSquare className="h-12 w-12" />
            <p className="text-lg font-medium text-neutral-500">No tasks yet</p>
            <Button size="sm" onClick={() => setDialog({ kind: "create" })}>
              Create your first task
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
            <p className="text-sm">Nothing matches the current filters</p>
            {hideCompleted && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => useTasksStore.getState().setHideCompleted(false)}
              >
                Show completed
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {visible.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                onEdit={() => setDialog({ kind: "edit", task })}
                onDelete={() => setDeleting(task)}
              />
            ))}
          </div>
        )}
      </div>

      <TaskFormDialog
        open={dialog.kind !== "closed"}
        onClose={() => setDialog({ kind: "closed" })}
        mode={dialog.kind === "create" ? "create" : "edit"}
        initial={dialog.kind === "edit" ? dialog.task : undefined}
      />

      <ConfirmDialog
        open={deleting !== null}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          const task = deleting
          setDeleting(null)
          if (!task) return
          try {
            await useTasksStore.getState().remove(task.id)
          } catch {
            /* store.error is set; phase 5 will surface it globally */
          }
        }}
        title="Delete task?"
        description={deleting ? `"${deleting.title}" will be permanently deleted.` : ""}
      />
    </div>
  )
}
