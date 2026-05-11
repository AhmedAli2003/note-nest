import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/app/ThemeProvider"
import { router } from "@/app/router"
import { useNotesStore } from "@/features/notes/store"
import { useTasksStore } from "@/features/tasks/store"
import { useArticlesStore } from "@/features/articles/store"
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts"
import { ToastViewport } from "@/components/ui/ToastViewport"
import { SearchDialog } from "@/features/search/SearchDialog"
import { SettingsDialog } from "@/features/settings/SettingsDialog"

function App() {
  useGlobalShortcuts()

  useEffect(() => {
    useNotesStore.getState().load()
    useTasksStore.getState().load()
    useArticlesStore.getState().load()
  }, [])

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <SearchDialog />
      <SettingsDialog />
      <ToastViewport />
    </ThemeProvider>
  )
}

export default App
