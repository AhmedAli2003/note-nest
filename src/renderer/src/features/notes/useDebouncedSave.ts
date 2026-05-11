import { useEffect, useRef, useState } from "react"
import { useNotesStore } from "./store"

type SaveStatus = "idle" | "saving" | "saved" | "error"

export function useDebouncedSave(
  noteId: string | null,
  text: string,
  delayMs = 500
): { status: SaveStatus; flush: () => void } {
  const [status, setStatus] = useState<SaveStatus>("idle")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noteIdRef = useRef(noteId)

  const doSave = async (id: string, t: string) => {
    setStatus("saving")
    try {
      await useNotesStore.getState().update(id, t)
      setStatus("saved")
    } catch {
      setStatus("error")
    }
  }

  const flush = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (noteIdRef.current) {
      doSave(noteIdRef.current, text)
    }
  }

  useEffect(() => {
    noteIdRef.current = noteId

    if (!noteId) {
      setStatus("idle")
      return
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      doSave(noteId, text)
    }, delayMs)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [text, noteId, delayMs])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (noteIdRef.current !== noteId) {
      flush()
      noteIdRef.current = noteId
    }
  }, [noteId])

  return { status, flush }
}
