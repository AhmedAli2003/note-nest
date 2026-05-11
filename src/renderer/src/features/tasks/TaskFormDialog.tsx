import { useState, useEffect, useRef } from "react"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { PriorityChip } from "./PriorityChip"
import { DateTimePicker } from "@/components/ui/DateTimePicker"
import { useTasksStore } from "./store"
import type { Task, Priority } from "@shared/types"

interface TaskFormDialogProps {
  open: boolean
  onClose: () => void
  mode: "create" | "edit"
  initial?: Task
}

export function TaskFormDialog({ open, onClose, mode, initial }: TaskFormDialogProps) {
  const [title, setTitle] = useState("")
  const [dueAt, setDueAt] = useState<number | null>(null)
  const [priority, setPriority] = useState<Priority>("medium")

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initial) {
        setTitle(initial.title)
        setDueAt(initial.due_at)
        setPriority(initial.priority)
      } else {
        setTitle("")
        setDueAt(null)
        setPriority("medium")
      }
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open, mode, initial])

  const trimmed = title.trim()
  const canSave = trimmed.length > 0

  const handleSubmit = async () => {
    if (!canSave) return
    try {
      if (mode === "create") {
        await useTasksStore.getState().create({ title: trimmed, due_at: dueAt, priority })
      } else if (initial) {
        await useTasksStore.getState().update({ id: initial.id, title: trimmed, due_at: dueAt, priority })
      }
      onClose()
    } catch {
      // store records error; UI surface in phase 5
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="task-form-title" className="max-w-lg">
      <h2 id="task-form-title" className="text-lg font-semibold">
        {mode === "create" ? "New task" : "Edit task"}
      </h2>

      <div className="mt-4 flex flex-col gap-4">
        <Input
          ref={inputRef}
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSave) handleSubmit()
          }}
        />

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Priority
          </label>
          <PriorityChip mode="select" value={priority} onChange={setPriority} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Due date
          </label>
          <DateTimePicker value={dueAt} onChange={setDueAt} />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!canSave} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </Modal>
  )
}
