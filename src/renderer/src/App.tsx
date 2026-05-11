import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/app/ThemeProvider"
import { router } from "@/app/router"
import { useNotesStore } from "@/features/notes/store"
import { useTasksStore } from "@/features/tasks/store"
import { useArticlesStore } from "@/features/articles/store"
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts"
import { useThemeStore } from "@/stores/theme"
import { ToastViewport } from "@/components/ui/ToastViewport"
import { SearchDialog } from "@/components/search/SearchDialog"
import { SettingsDialog } from "@/components/settings/SettingsDialog"

function App() {
  useGlobalShortcuts()

  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    useNotesStore.getState().load()
    useTasksStore.getState().load()
    useArticlesStore.getState().load()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

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
