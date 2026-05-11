import { cn } from "@/lib/cn"
import { formatRelativeTime } from "@/lib/time"
import type { Note } from "@shared/types"

interface NotesListItemProps {
  note: Note
  isSelected: boolean
  onSelect: () => void
}

function firstLine(text: string): string {
  const line = text.split("\n").find((l) => l.trim().length > 0)
  return line ?? ""
}

function secondLine(text: string): string {
  const lines = text.split("\n").filter((l) => l.trim().length > 0)
  return lines.length > 1 ? lines[1] : ""
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "…" : s
}

export function NotesListItem({ note, isSelected, onSelect }: NotesListItemProps) {
  const title = firstLine(note.text)
  const second = secondLine(note.text)

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-md px-3 py-2 text-left transition-colors",
        isSelected
          ? "bg-neutral-200 dark:bg-neutral-800"
          : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
          {title ? truncate(title, 50) : <span className="italic text-neutral-400">Empty note</span>}
        </span>
        <span className="shrink-0 text-xs text-neutral-400">
          {formatRelativeTime(note.updated_at)}
        </span>
      </div>
      {second && (
        <p className="mt-0.5 truncate text-xs text-neutral-500">
          {truncate(second, 60)}
        </p>
      )}
    </button>
  )
}
