import { ipcMain } from "electron"
import { searchNotes } from "../db/repos/notesRepo"
import { searchTasks } from "../db/repos/tasksRepo"
import { searchArticles } from "../db/repos/articlesRepo"
import { assertString } from "./validate"

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
