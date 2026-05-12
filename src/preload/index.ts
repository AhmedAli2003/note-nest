import { contextBridge, ipcRenderer } from "electron"
import type {
  Note,
  NoteCreateInput,
  NoteUpdateInput,
  Task,
  TaskCreateInput,
  TaskUpdateInput,
  Article,
  ArticleCreateInput,
  ArticleUpdateInput,
  SearchResults,
} from "@shared/types"

const api = {
  ping: () => ipcRenderer.invoke("app:ping") as Promise<"pong">,
  notes: {
    list: () => ipcRenderer.invoke("notes:list") as Promise<Note[]>,
    get: (id: string) => ipcRenderer.invoke("notes:get", id) as Promise<Note | null>,
    create: (input: NoteCreateInput) => ipcRenderer.invoke("notes:create", input) as Promise<Note>,
    update: (input: NoteUpdateInput) => ipcRenderer.invoke("notes:update", input) as Promise<Note>,
    remove: (id: string) => ipcRenderer.invoke("notes:delete", id) as Promise<void>,
  },
  tasks: {
    list: () => ipcRenderer.invoke("tasks:list") as Promise<Task[]>,
    get: (id: string) => ipcRenderer.invoke("tasks:get", id) as Promise<Task | null>,
    create: (input: TaskCreateInput) => ipcRenderer.invoke("tasks:create", input) as Promise<Task>,
    update: (input: TaskUpdateInput) => ipcRenderer.invoke("tasks:update", input) as Promise<Task>,
    remove: (id: string) => ipcRenderer.invoke("tasks:delete", id) as Promise<void>,
  },
  articles: {
    list: () => ipcRenderer.invoke("articles:list") as Promise<Article[]>,
    get: (id: string) => ipcRenderer.invoke("articles:get", id) as Promise<Article | null>,
    create: (input: ArticleCreateInput) => ipcRenderer.invoke("articles:create", input) as Promise<Article>,
    update: (input: ArticleUpdateInput) => ipcRenderer.invoke("articles:update", input) as Promise<Article>,
    remove: (id: string) => ipcRenderer.invoke("articles:delete", id) as Promise<void>,
  },
  search: {
    all: (query: string) => ipcRenderer.invoke("search:all", query) as Promise<SearchResults>,
  },
  app: {
    openExternal: (url: string) => ipcRenderer.invoke("app:openExternal", url) as Promise<void>,
    exportDb: () => ipcRenderer.invoke("app:exportDb") as Promise<string | null>,
    importDb: () => ipcRenderer.invoke("app:importDb") as Promise<"merged" | "replaced" | null>,
  },
}

contextBridge.exposeInMainWorld("api", api)

export type Api = typeof api
