import { ipcMain, shell, dialog, BrowserWindow, app } from "electron"
import { closeDb, getDb } from "../db"
import { join } from "path"
import { copyFileSync } from "fs"
import Database from "better-sqlite3"
import { assertString } from "./validate"

function sourceDbPath(): string {
  return join(app.getPath("userData"), "note-nest.db")
}

export function registerAppIpc(): void {
  ipcMain.handle("app:openExternal", (_e, url: unknown) => {
    assertString(url, "url")
    if (!/^(https?:|mailto:)/i.test(url)) {
      throw new Error("Refused unsafe URL scheme")
    }
    return shell.openExternal(url)
  })

  ipcMain.handle("app:exportDb", async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return null
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      title: "Export Note Nest database",
      defaultPath: `note-nest-${new Date().toISOString().slice(0, 10)}.db`,
      filters: [{ name: "SQLite database", extensions: ["db"] }],
    })
    if (canceled || !filePath) return null
    closeDb()
    try {
      copyFileSync(sourceDbPath(), filePath)
    } finally {
      getDb()
    }
    return filePath
  })

  ipcMain.handle("app:importDb", async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return null
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      title: "Import database",
      filters: [{ name: "SQLite database", extensions: ["db"] }],
      properties: ["openFile"],
    })
    if (canceled || filePaths.length === 0) return null
    const importPath = filePaths[0]

    const { response } = await dialog.showMessageBox(win, {
      type: "question",
      title: "Import database",
      message: "How do you want to import the database?",
      detail: `File: ${importPath}`,
      buttons: ["Merge (keep existing, add new)", "Replace (overwrite all data)", "Cancel"],
      defaultId: 0,
      cancelId: 2,
    })

    if (response === 2) return null

    if (response === 1) {
      closeDb()
      try {
        copyFileSync(importPath, sourceDbPath())
      } finally {
        getDb()
      }
      return "replaced"
    }

    const srcDb = new Database(importPath, { readonly: true })
    const dstDb = getDb()
    try {
      const tables: [string, string, string[]][] = [
        ["notes", "id, text, created_at, updated_at", ["id", "text", "created_at", "updated_at"]],
        ["tasks", "id, title, due_at, priority, is_done, created_at, updated_at", ["id", "title", "due_at", "priority", "is_done", "created_at", "updated_at"]],
        ["articles", "id, title, body_json, body_html, created_at, updated_at", ["id", "title", "body_json", "body_html", "created_at", "updated_at"]],
      ]
      for (const [table, cols, _colList] of tables) {
        const rows = srcDb.prepare(`SELECT ${cols} FROM ${table}`).all() as Record<string, unknown>[]
        if (rows.length === 0) continue
        const placeholders = cols.split(",").map(() => "?").join(",")
        const insert = dstDb.prepare(`INSERT OR IGNORE INTO ${table} (${cols}) VALUES (${placeholders})`)
        const insertMany = dstDb.transaction((batch: Record<string, unknown>[]) => {
          for (const row of batch) insert.run(...cols.split(",").map((c) => row[c.trim()]))
        })
        insertMany(rows)
      }
      return "merged"
    } finally {
      srcDb.close()
    }
  })
}
