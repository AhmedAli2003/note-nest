import { useEffect, useRef, useState, useCallback } from "react"
import { Search, FileText, StickyNote, CheckSquare, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { useSearchStore } from "@/features/search/store"
import type { Note, Task, Article } from "@shared/types"

function NoteResult({ note, onClose }: { note: Note; onClose: () => void }) {
  const nav = useNavigate()
  return (
    <button
      onClick={() => { nav("/notes"); onClose() }}
      className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
      <span className="line-clamp-2 text-neutral-900 dark:text-neutral-100">{note.text}</span>
    </button>
  )
}

function TaskResult({ task, onClose }: { task: Task; onClose: () => void }) {
  const nav = useNavigate()
  return (
    <button
      onClick={() => { nav("/tasks"); onClose() }}
      className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
      <span className="line-clamp-2 text-neutral-900 dark:text-neutral-100">{task.title}</span>
    </button>
  )
}

function ArticleResult({ article, onClose }: { article: Article; onClose: () => void }) {
  const nav = useNavigate()
  return (
    <button
      onClick={() => { nav("/articles"); onClose() }}
      className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
    >
      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
      <span className="line-clamp-2 text-neutral-900 dark:text-neutral-100">{article.title}</span>
    </button>
  )
}

export function SearchDialog() {
  const { open, closeDialog, query, setQuery, results, isSearching, runSearch } = useSearchStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const handleChange = useCallback((val: string) => {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(runSearch, 300)
  }, [setQuery, runSearch])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const { notes, tasks, articles } = results
  const hasResults = notes.length > 0 || tasks.length > 0 || articles.length > 0

  return (
    <Modal open={open} onClose={closeDialog} className="max-w-lg">
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-700">
        <Search className="h-5 w-5 text-neutral-400" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search notes, tasks, articles…"
          className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        {isSearching && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
      </div>

      {query.trim() && !isSearching && !hasResults && (
        <p className="py-8 text-center text-sm text-neutral-400">No results found</p>
      )}

      <div className="mt-3 flex max-h-80 flex-col gap-1 overflow-y-auto">
        {notes.length > 0 && (
          <div>
            <p className="mb-1 px-3 text-xs font-medium text-neutral-400">Notes</p>
            {notes.map((n) => (
              <NoteResult key={n.id} note={n} onClose={closeDialog} />
            ))}
          </div>
        )}

        {tasks.length > 0 && (
          <div className="mt-2">
            <p className="mb-1 px-3 text-xs font-medium text-neutral-400">Tasks</p>
            {tasks.map((t) => (
              <TaskResult key={t.id} task={t} onClose={closeDialog} />
            ))}
          </div>
        )}

        {articles.length > 0 && (
          <div className="mt-2">
            <p className="mb-1 px-3 text-xs font-medium text-neutral-400">Articles</p>
            {articles.map((a) => (
              <ArticleResult key={a.id} article={a} onClose={closeDialog} />
            ))}
          </div>
        )}
      </div>

      <p className="mt-3 border-t border-neutral-200 pt-3 text-xs text-neutral-400 dark:border-neutral-700">
        <kbd className="rounded border border-neutral-300 px-1 text-[10px] dark:border-neutral-600">Ctrl+F</kbd> to search
      </p>
    </Modal>
  )
}
