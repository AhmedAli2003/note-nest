import { NavLink } from "react-router-dom"
import { Notebook, CheckSquare, StickyNote, FileText } from "lucide-react"
import { cn } from "@/lib/cn"
import { useNotesStore } from "@/features/notes/store"
import { useTasksStore } from "@/features/tasks/store"
import { useArticlesStore } from "@/features/articles/store"

const navItems = [
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/articles", label: "Articles", icon: FileText }
] as const

export function Sidebar() {
  const noteCount = useNotesStore((s) => s.notes.length)
  const taskCount = useTasksStore((s) => s.tasks.filter((t) => !t.is_done).length)
  const articleCount = useArticlesStore((s) => s.articles.length)

  return (
    <aside className="flex w-56 flex-col border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
        <Notebook className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
        <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Note Nest
        </span>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-200"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.to === "/notes" && noteCount > 0 && (
              <span className="rounded-full bg-neutral-300 px-2 text-xs text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                {noteCount}
              </span>
            )}
            {item.to === "/tasks" && taskCount > 0 && (
              <span className="rounded-full bg-neutral-300 px-2 text-xs text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                {taskCount}
              </span>
            )}
            {item.to === "/articles" && articleCount > 0 && (
              <span className="rounded-full bg-neutral-300 px-2 text-xs text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                {articleCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
