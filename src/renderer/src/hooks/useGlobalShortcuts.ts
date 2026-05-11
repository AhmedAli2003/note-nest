import { useEffect } from "react"
import { router } from "@/app/router"
import { useSearchStore } from "@/features/search/store"
import { useNotesStore } from "@/features/notes/store"
import { useTasksStore } from "@/features/tasks/store"
import { useArticlesStore } from "@/features/articles/store"
import { useSettingsStore } from "@/stores/settings"

export function useGlobalShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return

      switch (e.key) {
        case "1":
          e.preventDefault()
          router.navigate("/tasks")
          break
        case "2":
          e.preventDefault()
          router.navigate("/notes")
          break
        case "3":
          e.preventDefault()
          router.navigate("/articles")
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
          { const path = router.state.location.pathname
            if (path === "/notes") useNotesStore.getState().create()
            if (path === "/articles") useArticlesStore.getState().create()
            if (path === "/tasks") useTasksStore.getState().requestCreate()
          }
          break
      }
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])
}
