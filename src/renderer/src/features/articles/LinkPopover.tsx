import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import type { Editor } from "@tiptap/react"

interface LinkPopoverProps {
  editor: Editor
  open: boolean
  onClose: () => void
  anchorRect: DOMRect | null
}

export function LinkPopover({ editor, open, onClose, anchorRect }: LinkPopoverProps) {
  const [url, setUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const current = (editor.getAttributes("link").href as string) ?? ""
      setUrl(current)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open, editor])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-link-popover]")) onClose()
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, onClose])

  const apply = () => {
    const v = url.trim()
    if (!v) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      const href = /^https?:\/\//i.test(v) || /^mailto:/i.test(v) ? v : `https://${v}`
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run()
    }
    onClose()
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    onClose()
  }

  if (!open || !anchorRect) return null

  return (
    <div
      data-link-popover
      className="fixed z-50 mt-1 flex items-center gap-2 rounded-lg border bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
      style={{
        left: anchorRect.left,
        top: anchorRect.bottom + 4,
      }}
    >
      <Input
        ref={inputRef}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") apply()
        }}
        placeholder="https://..."
        className="h-8 w-56 text-sm"
      />
      <Button size="sm" onClick={apply}>
        Apply
      </Button>
      {editor.getAttributes("link").href && (
        <Button size="sm" variant="ghost" onClick={removeLink}>
          Remove
        </Button>
      )}
    </div>
  )
}
