import { Modal } from "@/components/ui/Modal"
import { useSettingsStore } from "@/stores/settings"
import { useThemeStore } from "@/stores/theme"
import { useTasksStore } from "@/features/tasks/store"

export function SettingsDialog() {
  const open = useSettingsStore((s) => s.open)
  const closeDialog = useSettingsStore((s) => s.closeDialog)
  const dateFormat = useSettingsStore((s) => s.dateFormat)
  const setDateFormat = useSettingsStore((s) => s.setDateFormat)
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const taskSortBy = useTasksStore((s) => s.sortBy)
  const setTaskSortBy = useTasksStore((s) => s.setSortBy)

  return (
    <Modal open={open} onClose={closeDialog} labelledBy="settings-title">
      <h2 id="settings-title" className="mb-4 text-lg font-semibold">
        Settings
      </h2>

      <div className="space-y-5">
        <section>
          <h3 className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Appearance
          </h3>
          <div className="flex gap-3">
            {(["light", "dark"] as const).map((t) => (
              <label
                key={t}
                className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
              >
                <input
                  type="radio"
                  name="theme"
                  value={t}
                  checked={theme === t}
                  onChange={() => setTheme(t)}
                  className="accent-neutral-900 dark:accent-white"
                />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Tasks default sort
          </h3>
          <div className="flex gap-3">
            {(["due", "priority", "status"] as const).map((s) => (
              <label
                key={s}
                className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
              >
                <input
                  type="radio"
                  name="taskSort"
                  value={s}
                  checked={taskSortBy === s}
                  onChange={() => setTaskSortBy(s)}
                  className="accent-neutral-900 dark:accent-white"
                />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Date format
          </h3>
          <div className="flex gap-3">
            {(["relative", "absolute"] as const).map((f) => (
              <label
                key={f}
                className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
              >
                <input
                  type="radio"
                  name="dateFormat"
                  value={f}
                  checked={dateFormat === f}
                  onChange={() => setDateFormat(f)}
                  className="accent-neutral-900 dark:accent-white"
                />
                {f === "relative" ? "Relative (2 hours ago)" : "Absolute (Jan 15)"}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            About
          </h3>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            Note Nest v0.1.0
          </p>
        </section>
      </div>
    </Modal>
  )
}
