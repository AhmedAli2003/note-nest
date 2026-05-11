import { ipcMain } from "electron"
import { searchNotes } from "../db/repos/notesRepo"
import { searchTasks } from "../db/repos/tasksRepo"
import { searchArticles } from "../db/repos/articlesRepo"

function assertString(v: unknown, name: string): asserts v is string {
  if (typeof v !== "string") throw new Error(`${name} must be a string`)
}

export function registerSearchIpc(): void {
  ipcMain.handle("search:all", (_e, query: unknown) => {
    assertString(query, "query")
    const q = query.trim()
    if (q.length === 0) return { notes: [], tasks: [], articles: [] }
    return {
      notes: searchNotes(q),
      tasks: searchTasks(q),
      articles: searchArticles(q),
    }
  })
}
