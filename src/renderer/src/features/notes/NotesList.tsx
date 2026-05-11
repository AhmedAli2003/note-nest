import { Plus, StickyNote } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useNotesStore } from "./store"
import { NotesListItem } from "./NotesListItem"

export function NotesList() {
  const notes = useNotesStore((s) => s.notes)
  const isLoaded = useNotesStore((s) => s.isLoaded)
  const selectedId = useNotesStore((s) => s.selectedId)
  const select = useNotesStore((s) => s.select)
  const create = useNotesStore((s) => s.create)

  return (
    <aside className="flex w-72 flex-col border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Notes
        </h2>
        <Button size="sm" onClick={() => create()}>
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {!isLoaded ? null : notes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 pt-12 text-neutral-400">
            <StickyNote className="h-8 w-8" />
            <p className="text-sm">No notes yet</p>
            <Button size="sm" variant="ghost" onClick={() => create()}>
              Create your first note
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {notes.map((note) => (
              <NotesListItem
                key={note.id}
                note={note}
                isSelected={note.id === selectedId}
                onSelect={() => select(note.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
