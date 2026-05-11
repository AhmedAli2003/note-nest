import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSearchStore } from "@/features/search/store"
import { useNotesStore } from "@/features/notes/store"
import { useTasksStore } from "@/features/tasks/store"
import { useArticlesStore } from "@/features/articles/store"
import { useSettingsStore } from "@/stores/settings"

export function useGlobalShortcuts() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return

      switch (e.key) {
        case "1":
          e.preventDefault()
          navigate("/tasks")
          break
        case "2":
          e.preventDefault()
          navigate("/notes")
          break
        case "3":
          e.preventDefault()
          navigate("/articles")
          break
        case "f":
          e.preventDefault()
          useSearchStore.getState().openDialog()
          break
        case ",":
          e.preventDefault()
          useSettingsStore.getState().openDialog()
          break
        case "n":
          e.preventDefault()
          switch (location.pathname) {
            case "/notes":
              useNotesStore.getState().create()
              break
            case "/articles":
              useArticlesStore.getState().create()
              break
            case "/tasks":
              useTasksStore.getState().requestCreate()
              break
          }
          break
      }
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [navigate, location.pathname])
}
