import { StickyNote } from "lucide-react"

export default function NotesPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
      <StickyNote className="h-12 w-12" />
      <p className="text-lg font-medium text-neutral-500">No notes yet</p>
      <p className="text-sm">Coming in phase 2</p>
    </div>
  )
}
