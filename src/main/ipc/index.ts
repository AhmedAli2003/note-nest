import { registerPingIpc } from "./ping"
import { registerNotesIpc } from "./notes"
import { registerTasksIpc } from "./tasks"
import { registerArticlesIpc } from "./articles"

export function registerIpc(): void {
  registerPingIpc()
  registerNotesIpc()
  registerTasksIpc()
  registerArticlesIpc()
}
