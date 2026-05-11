import { Modal } from "@/components/ui/Modal"
import { useSettingsStore } from "@/stores/settings"

export function SettingsDialog() {
  const { open, closeDialog, dateFormat, setDateFormat } = useSettingsStore()

  return (
    <Modal open={open} onClose={closeDialog} labelledBy="settings-title">
      <h2 id="settings-title" className="mb-4 text-lg font-semibold">
        Settings
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Date format
          </label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value as "relative" | "absolute")}
            className="rounded-lg border border-neutral-300 bg-transparent px-3 py-1.5 text-sm dark:border-neutral-700 dark:text-neutral-100"
          >
            <option value="relative">Relative (2 hours ago)</option>
            <option value="absolute">Absolute (Jan 15)</option>
          </select>
        </div>
      </div>
    </Modal>
  )
}
