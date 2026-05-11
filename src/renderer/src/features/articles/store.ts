import { create } from "zustand"
import type { Article, ArticleUpdateInput } from "@shared/types"
import { useToastStore } from "@/stores/toasts"

interface ArticlesState {
  articles: Article[]
  selectedId: string | null
  isLoaded: boolean
  error: string | null
  load: () => Promise<void>
  select: (id: string | null) => void
  create: () => Promise<Article>
  update: (input: ArticleUpdateInput) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useArticlesStore = create<ArticlesState>()((set) => ({
  articles: [],
  selectedId: null,
  isLoaded: false,
  error: null,

  load: async () => {
    try {
      const articles = await window.api.articles.list()
      set({ articles, isLoaded: true, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load articles"
      set({ error: message })
      useToastStore.getState().push({ kind: "error", message })
      throw err
    }
  },

  select: (id) => set({ selectedId: id }),

  create: async () => {
    try {
      const article = await window.api.articles.create({
        title: "",
        body_json: "",
        body_html: "",
      })
      set((s) => ({
        articles: [article, ...s.articles],
        selectedId: article.id,
        error: null,
      }))
      return article
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create article"
      set({ error: message })
      useToastStore.getState().push({ kind: "error", message })
      throw err
    }
  },

  update: async (input) => {
    try {
      const updated = await window.api.articles.update(input)
      set((s) => {
        const articles = s.articles
          .map((a) => (a.id === input.id ? updated : a))
          .sort((a, b) => b.updated_at - a.updated_at)
        return { articles, error: null }
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save article"
      set({ error: message })
      useToastStore.getState().push({ kind: "error", message })
      throw err
    }
  },

  remove: async (id) => {
    try {
      await window.api.articles.remove(id)
      set((s) => {
        const articles = s.articles.filter((a) => a.id !== id)
        const selectedId = s.selectedId === id ? null : s.selectedId
        return { articles, selectedId, error: null }
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete article"
      set({ error: message })
      useToastStore.getState().push({ kind: "error", message })
      throw err
    }
  },
}))

export function selectSelectedArticle(state: ArticlesState): Article | null {
  return state.articles.find((a) => a.id === state.selectedId) ?? null
}
