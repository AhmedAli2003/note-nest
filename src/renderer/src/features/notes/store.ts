import { create } from "zustand"
import type { Note } from "@shared/types"

interface NotesState {
  notes: Note[]
  selectedId: string | null
  isLoaded: boolean
  error: string | null
  load: () => Promise<void>
  select: (id: string | null) => void
  create: () => Promise<Note>
  update: (id: string, text: string) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useNotesStore = create<NotesState>()((set, get) => ({
  notes: [],
  selectedId: null,
  isLoaded: false,
  error: null,

  load: async () => {
    try {
      const notes = await window.api.notes.list()
      set({ notes, isLoaded: true, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load notes"
      set({ error: message })
      throw err
    }
  },

  select: (id) => set({ selectedId: id }),

  create: async () => {
    try {
      const note = await window.api.notes.create({ text: "" })
      set((s) => ({
        notes: [note, ...s.notes],
        selectedId: note.id,
        error: null
      }))
      return note
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create note"
      set({ error: message })
      throw err
    }
  },

  update: async (id, text) => {
    try {
      const updated = await window.api.notes.update({ id, text })
      set((s) => {
        const notes = s.notes
          .map((n) => (n.id === id ? updated : n))
          .sort((a, b) => b.updated_at - a.updated_at)
        return { notes, error: null }
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save note"
      set({ error: message })
      throw err
    }
  },

  remove: async (id) => {
    try {
      await window.api.notes.remove(id)
      set((s) => {
        const notes = s.notes.filter((n) => n.id !== id)
        const selectedId = s.selectedId === id ? null : s.selectedId
        return { notes, selectedId, error: null }
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete note"
      set({ error: message })
      throw err
    }
  }
}))

export function selectSelectedNote(state: NotesState): Note | null {
  return state.notes.find((n) => n.id === state.selectedId) ?? null
}
