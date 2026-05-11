import { ipcMain } from "electron"
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} from "../db/repos/notesRepo"
import { assertString } from "./validate"
import type { NoteCreateInput, NoteUpdateInput } from "../../shared/types"

export function registerNotesIpc(): void {
  ipcMain.handle("notes:list", () => listNotes())

  ipcMain.handle("notes:get", (_e, id: unknown) => {
    assertString(id, "id")
    return getNote(id)
  })

  ipcMain.handle("notes:create", (_e, input: unknown) => {
    const { text } = input as NoteCreateInput
    assertString(text, "text")
    return createNote({ text })
  })

  ipcMain.handle("notes:update", (_e, input: unknown) => {
    const { id, text } = input as NoteUpdateInput
    assertString(id, "id")
    assertString(text, "text")
    return updateNote({ id, text })
  })

  ipcMain.handle("notes:delete", (_e, id: unknown) => {
    assertString(id, "id")
    deleteNote(id)
  })
}
