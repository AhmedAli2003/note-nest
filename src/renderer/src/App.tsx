import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/app/ThemeProvider"
import { router } from "@/app/router"
import { useNotesStore } from "@/features/notes/store"
import { useTasksStore } from "@/features/tasks/store"
import { useArticlesStore } from "@/features/articles/store"

function App() {
  useEffect(() => {
    useNotesStore.getState().load()
    useTasksStore.getState().load()
    useArticlesStore.getState().load()
  }, [])

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
