import { getDb } from ".."
import { newId } from "@shared/id"
import type { Note, NoteCreateInput, NoteUpdateInput } from "@shared/types"

const db = getDb()

const stmt = {
  list: db.prepare("SELECT * FROM notes ORDER BY updated_at DESC"),
  get: db.prepare("SELECT * FROM notes WHERE id = ?"),
  insert: db.prepare(
    "INSERT INTO notes (id, text, created_at, updated_at) VALUES (?, ?, ?, ?)"
  ),
  update: db.prepare("UPDATE notes SET text = ?, updated_at = ? WHERE id = ?"),
  delete: db.prepare("DELETE FROM notes WHERE id = ?")
}

function rowToNote(row: Record<string, unknown>): Note {
  return {
    id: row.id as string,
    text: row.text as string,
    created_at: row.created_at as number,
    updated_at: row.updated_at as number
  }
}

export function listNotes(): Note[] {
  return (stmt.list.all() as Record<string, unknown>[]).map(rowToNote)
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
