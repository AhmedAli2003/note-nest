import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, TaskCreateInput, TaskUpdateInput } from "@shared/types"

type SortKey = "due" | "priority" | "status"

interface TasksState {
  tasks: Task[]
  isLoaded: boolean
  error: string | null
  sortBy: SortKey
  hideCompleted: boolean
  load: () => Promise<void>
  create: (input: TaskCreateInput) => Promise<Task>
  update: (input: TaskUpdateInput) => Promise<void>
  toggle: (id: string) => Promise<void>
  remove: (id: string) => Promise<void>
  setSortBy: (s: SortKey) => void
  setHideCompleted: (b: boolean) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isLoaded: false,
      error: null,
      sortBy: "due",
      hideCompleted: false,

      load: async () => {
        try {
          const tasks = await window.api.tasks.list()
          set({ tasks, isLoaded: true, error: null })
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to load tasks"
          set({ error: message })
          throw err
        }
      },

      create: async (input) => {
        try {
          const task = await window.api.tasks.create(input)
          set((s) => ({ tasks: [task, ...s.tasks], error: null }))
          return task
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to create task"
          set({ error: message })
          throw err
        }
      },

      update: async (input) => {
        try {
          const updated = await window.api.tasks.update(input)
          set((s) => ({
            tasks: s.tasks.map((t) => (t.id === input.id ? updated : t)),
            error: null,
          }))
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to update task"
          set({ error: message })
          throw err
        }
      },

      toggle: async (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return
        try {
          const updated = await window.api.tasks.update({ id, is_done: !task.is_done })
          set((s) => ({
            tasks: s.tasks.map((t) => (t.id === id ? updated : t)),
            error: null,
          }))
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to toggle task"
          set({ error: message })
          throw err
        }
      },

      remove: async (id) => {
        try {
          await window.api.tasks.remove(id)
          set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id), error: null }))
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to delete task"
          set({ error: message })
          throw err
        }
      },

      setSortBy: (sortBy) => set({ sortBy }),
      setHideCompleted: (hideCompleted) => set({ hideCompleted }),
    }),
    {
      name: "note-nest:tasks:prefs",
      partialize: (state) => ({
        sortBy: state.sortBy,
        hideCompleted: state.hideCompleted,
      }),
    }
  )
)
