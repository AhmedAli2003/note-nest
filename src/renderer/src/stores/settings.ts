import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsState {
  open: boolean
  dateFormat: "relative" | "absolute"
  openDialog: () => void
  closeDialog: () => void
  setDateFormat: (f: "relative" | "absolute") => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      open: false,
      dateFormat: "relative",

      openDialog: () => set({ open: true }),
      closeDialog: () => set({ open: false }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
    }),
    {
      name: "note-nest:settings:prefs",
      partialize: (state) => ({ dateFormat: state.dateFormat }),
    }
  )
)
