import { useCallback, useEffect, useRef, useState } from "react"
import { useNotesStore } from "./store"

type SaveStatus = "idle" | "saving" | "saved" | "error"

export function useDebouncedSave(
  noteId: string | null,
  text: string,
  delayMs = 500
) {
  const [status, setStatus] = useState<SaveStatus>("idle")

  const savedRef = useRef<{ id: string | null; text: string }>({
    id: null,
    text: ""
  })

  const latestRef = useRef({ noteId, text })
  latestRef.current = { noteId, text }

  const save = useCallback(async (id: string, t: string) => {
    if (savedRef.current.id === id && savedRef.current.text === t) return
    setStatus("saving")
    try {
      await useNotesStore.getState().update(id, t)
      savedRef.current = { id, text: t }
      setStatus("saved")
    } catch {
      setStatus("error")
    }
  }, [])

  const flush = useCallback(() => {
    const { noteId: id, text: t } = latestRef.current
    if (id) void save(id, t)
  }, [save])

  const seed = useCallback((id: string, t: string) => {
    savedRef.current = { id, text: t }
    setStatus("idle")
  }, [])

  useEffect(() => {
    if (!noteId) {
      setStatus("idle")
      return
    }
    if (savedRef.current.id === noteId && savedRef.current.text === text) return

    const timer = setTimeout(() => void save(noteId, text), delayMs)
    return () => clearTimeout(timer)
  }, [noteId, text, delayMs, save])

  useEffect(() => {
    const capturedId = noteId
    return () => {
      if (!capturedId) return
      const t = latestRef.current.text
      if (savedRef.current.id !== capturedId || savedRef.current.text !== t) {
        void save(capturedId, t)
      }
    }
  }, [noteId, save])

  return { status, flush, seed }
}
