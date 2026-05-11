import { ipcMain, shell, dialog, BrowserWindow, app } from "electron"
import { closeDb, getDb } from "../db"
import { join } from "path"
import { copyFileSync } from "fs"
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
}
