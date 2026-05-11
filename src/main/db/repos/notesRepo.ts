import { getDb } from ".."
import { newId } from "../../../shared/id"
import type { Note, NoteCreateInput, NoteUpdateInput } from "../../../shared/types"

const stmt = {
  list: getDb().prepare("SELECT * FROM notes ORDER BY updated_at DESC"),
  get: getDb().prepare("SELECT * FROM notes WHERE id = ?"),
  insert: getDb().prepare(
    "INSERT INTO notes (id, text, created_at, updated_at) VALUES (?, ?, ?, ?)"
  ),
  update: getDb().prepare("UPDATE notes SET text = ?, updated_at = ? WHERE id = ?"),
  delete: getDb().prepare("DELETE FROM notes WHERE id = ?")
}

function rowToNote(row: Record<string, unknown>): Note {
  return row as unknown as Note
}

export function listNotes(): Note[] {
  return stmt.list.all() as Note[]
}

export function getNote(id: string): Note | null {
  const row = stmt.get.get(id) as Record<string, unknown> | undefined
  return row ? rowToNote(row) : null
}

export function createNote(input: NoteCreateInput): Note {
  const now = Date.now()
  const id = newId()
  stmt.insert.run(id, input.text, now, now)
  return getNote(id)!
}

export function updateNote(input: NoteUpdateInput): Note {
  const now = Date.now()
  const result = stmt.update.run(input.text, now, input.id)
  if (result.changes === 0) throw new Error(`notes ${input.id} not found`)
  return getNote(input.id)!
}

export function deleteNote(id: string): void {
  stmt.delete.run(id)
}
