import { type ReactNode, useEffect, useRef } from "react"
import { cn } from "@/lib/cn"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  labelledBy?: string
  className?: string
}

export function Modal({ open, onClose, children, labelledBy, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (open && !el.open) {
      el.showModal()
    } else if (!open && el.open) {
      el.close()
    }
  }, [open])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleClose = () => onClose()
    el.addEventListener("close", handleClose)
    return () => el.removeEventListener("close", handleClose)
  }, [onClose])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className={cn(
        "rounded-xl bg-white p-0 shadow-2xl dark:bg-neutral-900",
        "max-w-md text-neutral-900 dark:text-neutral-100",
        "backdrop:bg-black/50",
        className
      )}
    >
      <div className="p-6">{children}</div>
    </dialog>
  )
}
