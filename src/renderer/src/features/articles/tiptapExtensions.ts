import StarterKit from "@tiptap/starter-kit"
import { Link } from "@tiptap/extension-link"
import { Placeholder } from "@tiptap/extension-placeholder"
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import { createLowlight, common } from "lowlight"

const lowlight = createLowlight(common)

export function buildExtensions(placeholder: string) {
  return [
    StarterKit.configure({ codeBlock: false }),
    CodeBlockLowlight.configure({ lowlight }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: "noopener noreferrer" },
    }),
    Placeholder.configure({ placeholder }),
  ]
}
