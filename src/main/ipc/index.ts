import { registerPingIpc } from "./ping"
import { registerNotesIpc } from "./notes"
import { registerTasksIpc } from "./tasks"
import { registerArticlesIpc } from "./articles"
import { registerSearchIpc } from "./search"
import { registerAppIpc } from "./app"

export function registerIpc(): void {
  registerPingIpc()
  registerNotesIpc()
  registerTasksIpc()
  registerArticlesIpc()
  registerSearchIpc()
  registerAppIpc()
}
