import { createHashRouter, Navigate } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import TasksPage from "@/features/tasks/TasksPage"
import NotesPage from "@/features/notes/NotesPage"
import ArticlesPage from "@/features/articles/ArticlesPage"

export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/tasks" replace /> },
      { path: "/tasks", element: <TasksPage /> },
      { path: "/notes", element: <NotesPage /> },
      { path: "/articles", element: <ArticlesPage /> }
    ]
  }
])
