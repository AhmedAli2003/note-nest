import { useLocation } from "react-router-dom"
import { Sun, Moon } from "lucide-react"
import { IconButton } from "@/components/ui/IconButton"
import { useThemeStore } from "@/stores/theme"

const titles: Record<string, string> = {
  "/tasks": "Tasks",
  "/notes": "Notes",
  "/articles": "Articles"
}

export function TopBar() {
  const location = useLocation()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  const title = titles[location.pathname] ?? ""

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900">
      <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h1>

      <IconButton
        aria-label="Toggle theme"
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </IconButton>
    </header>
  )
}
