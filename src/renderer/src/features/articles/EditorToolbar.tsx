import { useState, useCallback } from "react"
import {
  Undo2, Redo2, Bold, Italic, Strikethrough, Code, CodeSquare,
  List, ListOrdered, Quote, Link2,
} from "lucide-react"
import { IconButton } from "@/components/ui/IconButton"
import { cn } from "@/lib/cn"
import { LinkPopover } from "./LinkPopover"
import type { Editor } from "@tiptap/react"

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkAnchor, setLinkAnchor] = useState<DOMRect | null>(null)

  if (!editor) return null

  const Btn = ({
    onClick,
    isActive,
    disabled,
    label,
    children,
  }: {
    onClick: (e: React.MouseEvent) => void
    isActive?: boolean
    disabled?: boolean
    label: string
    children: React.ReactNode
  }) => (
    <IconButton
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(isActive && "bg-neutral-200 dark:bg-neutral-700")}
    >
      {children}
    </IconButton>
  )

  const btnClass = "h-4 w-4"

  const closeLink = useCallback(() => {
    setLinkOpen(false)
    setLinkAnchor(null)
  }, [])

  return (
    <div className="relative flex items-center gap-1 border-b border-neutral-200 px-2 py-1 dark:border-neutral-800">
      <Btn
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 className={btnClass} />
      </Btn>
      <Btn
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 className={btnClass} />
      </Btn>

      <span className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-700" />

      <Btn
        label="Heading 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
      >
        <span className="text-xs font-bold">H1</span>
      </Btn>
      <Btn
        label="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
      >
        <span className="text-xs font-bold">H2</span>
      </Btn>
      <Btn
        label="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
      >
        <span className="text-xs font-bold">H3</span>
      </Btn>

      <span className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-700" />

      <Btn
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        <Bold className={btnClass} />
      </Btn>
      <Btn
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        <Italic className={btnClass} />
      </Btn>
      <Btn
        label="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
      >
        <Strikethrough className={btnClass} />
      </Btn>

      <span className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-700" />

      <Btn
        label="Inline code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
      >
        <Code className={btnClass} />
      </Btn>
      <Btn
        label="Code block"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
      >
        <CodeSquare className={btnClass} />
      </Btn>

      <span className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-700" />

      <Btn
        label="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      >
        <List className={btnClass} />
      </Btn>
      <Btn
        label="Ordered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        <ListOrdered className={btnClass} />
      </Btn>

      <span className="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-700" />

      <Btn
        label="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
      >
        <Quote className={btnClass} />
      </Btn>

      <Btn
        label="Link"
        onClick={(e: React.MouseEvent) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
          setLinkAnchor(rect)
          setLinkOpen(true)
        }}
        isActive={editor.isActive("link")}
      >
        <Link2 className={btnClass} />
      </Btn>

      <LinkPopover
        editor={editor}
        open={linkOpen}
        onClose={closeLink}
        anchorRect={linkAnchor}
      />
    </div>
  )
}
