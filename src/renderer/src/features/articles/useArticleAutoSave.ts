import { useCallback, useEffect, useRef, useState } from "react"
import { useArticlesStore } from "./store"

type SaveStatus = "idle" | "saving" | "saved" | "error"

export interface ArticleDraft {
  title: string
  bodyJson: string
  bodyHtml: string
}

function shallowEqualDraft(
  a: { title: string; bodyJson: string; bodyHtml: string },
  b: { title: string; bodyJson: string; bodyHtml: string }
): boolean {
  return a.title === b.title && a.bodyJson === b.bodyJson && a.bodyHtml === b.bodyHtml
}

export function useArticleAutoSave(
  articleId: string | null,
  draft: ArticleDraft,
  delayMs = 500
) {
  const [status, setStatus] = useState<SaveStatus>("idle")

  const savedRef = useRef<{ id: string | null } & ArticleDraft>({
    id: null,
    title: "",
    bodyJson: "",
    bodyHtml: "",
  })

  const latestRef = useRef({ articleId, draft })
  latestRef.current = { articleId, draft }

  const save = useCallback(async (id: string, d: ArticleDraft) => {
    if (savedRef.current.id === id && shallowEqualDraft(savedRef.current, d)) return
    setStatus("saving")
    try {
      await useArticlesStore.getState().update({
        id,
        title: d.title,
        body_json: d.bodyJson,
        body_html: d.bodyHtml,
      })
      savedRef.current = { id, ...d }
      setStatus("saved")
    } catch {
      setStatus("error")
    }
  }, [])

  const flush = useCallback(() => {
    const { articleId: id, draft: d } = latestRef.current
    if (id) void save(id, d)
  }, [save])

  const seed = useCallback((id: string, d: ArticleDraft) => {
    savedRef.current = { id, ...d }
    setStatus("idle")
  }, [])

  useEffect(() => {
    if (!articleId) {
      setStatus("idle")
      return
    }
    if (
      savedRef.current.id === articleId &&
      shallowEqualDraft(savedRef.current, draft)
    )
      return

    const timer = setTimeout(() => void save(articleId, draft), delayMs)
    return () => clearTimeout(timer)
  }, [articleId, draft, delayMs, save])

  useEffect(() => {
    return () => {
      const { articleId: id, draft: d } = latestRef.current
      if (id && (savedRef.current.id !== id || !shallowEqualDraft(savedRef.current, d))) {
        void save(id, d)
      }
    }
  }, [articleId, save])

  return { status, flush, seed }
}
