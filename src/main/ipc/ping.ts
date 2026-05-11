import { ipcMain } from "electron"

export function registerPingIpc(): void {
  ipcMain.handle("app:ping", () => "pong" as const)
}
