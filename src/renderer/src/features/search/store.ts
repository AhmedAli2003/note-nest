import { create } from "zustand"
import type { SearchResults } from "@shared/types"
import { useToastStore } from "@/stores/toasts"

interface SearchState {
  open: boolean
  query: string
  results: SearchResults
  isSearching: boolean
  openDialog: () => void
  closeDialog: () => void
  setQuery: (q: string) => void
  runSearch: () => Promise<void>
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  open: false,
  query: "",
  results: { notes: [], tasks: [], articles: [] },
  isSearching: false,

  openDialog: () => set({ open: true }),
  closeDialog: () => set({ open: false }),

  setQuery: (query) => set({ query }),

  runSearch: async () => {
    const { query } = get()
    if (!query.trim()) {
      set({ results: { notes: [], tasks: [], articles: [] }, isSearching: false })
      return
    }
    set({ isSearching: true })
    try {
      const results = await window.api.search.all(query)
      set({ results, isSearching: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Search failed"
      useToastStore.getState().push({ kind: "error", message })
      set({ isSearching: false })
    }
  },
}))
