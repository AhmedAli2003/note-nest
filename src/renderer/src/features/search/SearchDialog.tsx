import { useEffect, useRef, useState, useCallback } from "react"
import { Search, FileText, StickyNote, CheckSquare, Loader2 } from "lucide-react"
import { router } from "@/app/router"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { useSearchStore } from "@/features/search/store"
import { useNotesStore } from "@/features/notes/store"
import { useArticlesStore } from "@/features/articles/store"
import { cn } from "@/lib/cn"

export function SearchDialog() {
  const open = useSearchStore((s) => s.open)
  const closeDialog = useSearchStore((s) => s.closeDialog)
  const query = useSearchStore((s) => s.query)
  const setQuery = useSearchStore((s) => s.setQuery)
  const results = useSearchStore((s) => s.results)
  const isSearching = useSearchStore((s) => s.isSearching)
  const runSearch = useSearchStore((s) => s.runSearch)

  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const [highlightIndex, setHighlightIndex] = useState(0)

  const handleChange = useCallback((val: string) => {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(runSearch, 250)
  }, [setQuery, runSearch])

  useEffect(() => {
    if (open) {
      setHighlightIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const { notes, tasks, articles } = results
  const notesLen = notes.length
  const tasksLen = tasks.length
  const flatLen = notesLen + tasksLen + articles.length

  const activate = useCallback((idx: number) => {
    if (idx < 0 || idx >= flatLen) return
    if (idx < notesLen) {
      useNotesStore.getState().select(notes[idx].id)
      router.navigate("/notes")
    } else if (idx < notesLen + tasksLen) {
      router.navigate("/tasks")
    } else {
      useArticlesStore.getState().select(articles[idx - notesLen - tasksLen].id)
      router.navigate("/articles")
    }
    closeDialog()
  }, [notes, tasks, articles, notesLen, tasksLen, flatLen, closeDialog])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((i) => (i + 1) % flatLen)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((i) => (i - 1 + flatLen) % flatLen)
    } else if (e.key === "Enter" && flatLen > 0) {
      e.preventDefault()
      activate(highlightIndex)
    }
  }, [flatLen, highlightIndex, activate])

  const hasResults = flatLen > 0

  return (
    <Modal open={open} onClose={closeDialog} className="max-w-lg">
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-700">
        <Search className="h-5 w-5 text-neutral-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search notes, tasks, articles…"
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        {isSearching && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
      </div>

      {!query.trim() && (
        <p className="py-8 text-center text-sm text-neutral-400">Type to search</p>
      )}

      {query.trim() && !isSearching && !hasResults && (
        <p className="py-8 text-center text-sm text-neutral-400">No results found</p>
      )}

      {hasResults && (
        <div className="mt-3 flex max-h-80 flex-col gap-1 overflow-y-auto">
          {notes.length > 0 && (
            <div>
              <p className="mb-1 px-3 text-xs font-medium text-neutral-400">Notes</p>
              {notes.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => activate(i)}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm",
                    i === highlightIndex
                      ? "bg-neutral-100 dark:bg-neutral-800/60"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <span className="line-clamp-2 text-neutral-900 dark:text-neutral-100">{n.text}</span>
                </button>
              ))}
            </div>
          )}

          {tasks.length > 0 && (
            <div className="mt-2">
              <p className="mb-1 px-3 text-xs font-medium text-neutral-400">Tasks</p>
              {tasks.map((t, i) => {
                const idx = notesLen + i
                return (
                  <button
                    key={t.id}
                    onClick={() => activate(idx)}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm",
                      idx === highlightIndex
                        ? "bg-neutral-100 dark:bg-neutral-800/60"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    <span className="line-clamp-2 text-neutral-900 dark:text-neutral-100">{t.title}</span>
                  </button>
                )
              })}
            </div>
          )}

          {articles.length > 0 && (
            <div className="mt-2">
              <p className="mb-1 px-3 text-xs font-medium text-neutral-400">Articles</p>
              {articles.map((a, i) => {
                const idx = notesLen + tasksLen + i
                return (
                  <button
                    key={a.id}
                    onClick={() => activate(idx)}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm",
                      idx === highlightIndex
                        ? "bg-neutral-100 dark:bg-neutral-800/60"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    <span className="line-clamp-2 text-neutral-900 dark:text-neutral-100">{a.title}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      <p className="mt-3 border-t border-neutral-200 pt-3 text-xs text-neutral-400 dark:border-neutral-700">
        <kbd className="rounded border border-neutral-300 px-1 text-[10px] dark:border-neutral-600">Ctrl+F</kbd> to search
        <span className="float-right">
          <kbd className="rounded border border-neutral-300 px-1 text-[10px] dark:border-neutral-600">↑↓</kbd> navigate
          <kbd className="ml-1 rounded border border-neutral-300 px-1 text-[10px] dark:border-neutral-600">⏎</kbd> open
        </span>
      </p>
    </Modal>
  )
}
