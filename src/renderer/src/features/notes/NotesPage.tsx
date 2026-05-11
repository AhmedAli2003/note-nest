import { useEffect } from "react"
import { useNotesStore } from "./store"
import { NotesList } from "./NotesList"
import { NoteEditor } from "./NoteEditor"

export default function NotesPage() {
  const load = useNotesStore((s) => s.load)

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="flex h-full">
      <NotesList />
      <NoteEditor />
    </div>
  )
}
