import { useEffect, useRef, useState } from "react"
import { FileText, Trash2 } from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import { Input } from "@/components/ui/Input"
import { IconButton } from "@/components/ui/IconButton"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { formatRelativeTime } from "@/lib/time"
import { useArticlesStore, selectSelectedArticle } from "./store"
import { useArticleAutoSave } from "./useArticleAutoSave"
import { buildExtensions } from "./tiptapExtensions"
import { EditorToolbar } from "./EditorToolbar"

export function ArticleEditor() {
  const selectedArticle = useArticlesStore(selectSelectedArticle)
  const remove = useArticlesStore((s) => s.remove)
  const [title, setTitle] = useState("")
  const [bodyJson, setBodyJson] = useState("")
  const [bodyHtml, setBodyHtml] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  const { status, flush, seed } = useArticleAutoSave(
    selectedArticle?.id ?? null,
    { title, bodyJson, bodyHtml }
  )

  const editor = useEditor({
    extensions: buildExtensions("Start writing or paste from ChatGPT…"),
    editorProps: {
      attributes: { class: "focus:outline-none" },
    },
    onUpdate: ({ editor: ed }) => {
      setBodyJson(JSON.stringify(ed.getJSON()))
      setBodyHtml(ed.getHTML())
    },
  })

  useEffect(() => {
    if (selectedArticle && titleRef.current) {
      titleRef.current.focus()
    }
  }, [selectedArticle?.id])

  useEffect(() => {
    if (!editor) return
    const onBlur = () => flush()
    editor.on("blur", onBlur)
    return () => { editor.off("blur", onBlur) }
  }, [editor, flush])

  useEffect(() => {
    if (!selectedArticle) return
    const parsed = selectedArticle.body_json
      ? JSON.parse(selectedArticle.body_json)
      : ""
    const draft = {
      title: selectedArticle.title,
      bodyJson: selectedArticle.body_json,
      bodyHtml: selectedArticle.body_html,
    }
    seed(selectedArticle.id, draft)
    setTitle(selectedArticle.title)
    setBodyJson(selectedArticle.body_json)
    setBodyHtml(selectedArticle.body_html)
    editor?.commands.setContent(parsed, false)
  }, [selectedArticle?.id, editor])

  if (!selectedArticle) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-400">
        <FileText className="h-12 w-12" />
        <p className="text-sm">Select an article or create a new one</p>
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
    setConfirmOpen(false)
    try {
      await remove(selectedArticle.id)
    } catch {
      /* store.error is set; phase 5 will surface it globally */
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-12 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400">
            {formatRelativeTime(selectedArticle.updated_at)}
          </span>
          {statusPill()}
        </div>
        <IconButton aria-label="Delete article" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="px-4 pt-4">
        <Input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={flush}
          placeholder="Article title"
          className="border-0 bg-transparent px-0 text-2xl font-semibold shadow-none focus-visible:ring-0"
        />
      </div>

      <EditorToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="prose prose-neutral max-w-none px-6 py-4 dark:prose-invert"
        />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this article?"
        description={selectedArticle.title.trim() || "(Untitled)"}
      />
    </div>
  )
}
