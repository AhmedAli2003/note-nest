import { getDb } from ".."
import { newId } from "../../../shared/id"
import type { Priority, Task, TaskCreateInput, TaskUpdateInput } from "../../../shared/types"

const stmt = {
  list: getDb().prepare("SELECT * FROM tasks ORDER BY created_at DESC"),
  get: getDb().prepare("SELECT * FROM tasks WHERE id = ?"),
  insert: getDb().prepare(
    "INSERT INTO tasks (id, title, due_at, priority, is_done, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ),
  delete: getDb().prepare("DELETE FROM tasks WHERE id = ?")
}

function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    due_at: (row.due_at as number) ?? null,
    priority: row.priority as Priority,
    is_done: (row.is_done as number) === 1,
    created_at: row.created_at as number,
    updated_at: row.updated_at as number
  }
}

export function listTasks(): Task[] {
  return (stmt.list.all() as Record<string, unknown>[]).map(rowToTask)
}

export function getTask(id: string): Task | null {
  const row = stmt.get.get(id) as Record<string, unknown> | undefined
  return row ? rowToTask(row) : null
}

export function createTask(input: TaskCreateInput): Task {
  const now = Date.now()
  const id = newId()
  stmt.insert.run(
    id,
    input.title,
    input.due_at ?? null,
    input.priority ?? "medium",
    0,
    now,
    now
  )
  return getTask(id)!
}

export function updateTask(input: TaskUpdateInput): Task {
  const now = Date.now()
  const sets: string[] = []
  const params: unknown[] = []

  if (input.title !== undefined) {
    sets.push("title = ?")
    params.push(input.title)
  }
  if (input.due_at !== undefined) {
    sets.push("due_at = ?")
    params.push(input.due_at)
  }
  if (input.priority !== undefined) {
    sets.push("priority = ?")
    params.push(input.priority)
  }
  if (input.is_done !== undefined) {
    sets.push("is_done = ?")
    params.push(input.is_done ? 1 : 0)
  }

  if (sets.length === 0) return getTask(input.id)!

  sets.push("updated_at = ?")
  params.push(now)
  params.push(input.id)

  const result = getDb().prepare(`UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`).run(...params)
  if (result.changes === 0) throw new Error(`tasks ${input.id} not found`)
  return getTask(input.id)!
}

export function deleteTask(id: string): void {
  stmt.delete.run(id)
}
