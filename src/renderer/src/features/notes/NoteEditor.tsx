import { useEffect, useRef, useState } from "react"
import { StickyNote, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/Textarea"
import { IconButton } from "@/components/ui/IconButton"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { formatRelativeTime } from "@/lib/time"
import { useNotesStore, selectSelectedNote } from "./store"
import { useDebouncedSave } from "./useDebouncedSave"
import type { Note } from "@shared/types"

export function NoteEditor() {
  const selectedNote = useNotesStore(selectSelectedNote)
  const remove = useNotesStore((s) => s.remove)
  const [text, setText] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { status, flush } = useDebouncedSave(
    selectedNote?.id ?? null,
    text
  )

  useEffect(() => {
    if (selectedNote) {
      setText(selectedNote.text)
    }
  }, [selectedNote?.id])

  useEffect(() => {
    if (selectedNote && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [selectedNote?.id])

  if (!selectedNote) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-400">
        <StickyNote className="h-12 w-12" />
        <p className="text-sm">Select a note or create a new one</p>
      </div>
    )
  }

  const statusPill = () => {
    switch (status) {
      case "saving":
        return <span className="text-xs text-amber-500">Saving…</span>
      case "saved":
        return <span className="text-xs text-green-500">Saved</span>
      case "error":
        return <span className="text-xs text-red-500">Save failed</span>
      default:
        return null
    }
  }

  const handleDelete = async () => {
    await remove(selectedNote.id)
    setConfirmOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-12 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400">
            {formatRelativeTime(selectedNote.updated_at)}
          </span>
          {statusPill()}
        </div>
        <IconButton aria-label="Delete note" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>

      <Textarea
        ref={textareaRef}
        className="flex-1"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing…"
      />

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this note?"
        description="This cannot be undone."
      />
    </div>
  )
}
