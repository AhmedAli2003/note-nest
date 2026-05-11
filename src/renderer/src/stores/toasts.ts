import { create } from "zustand"

type ToastKind = "success" | "error" | "info"

interface Toast {
  id: string
  kind: ToastKind
  message: string
  timeoutMs: number
}

interface ToastsState {
  toasts: Toast[]
  push: (t: { kind: ToastKind; message: string; timeoutMs?: number }) => string
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastsState>()((set, get) => ({
  toasts: [],

  push: ({ kind, message, timeoutMs }) => {
    const id = crypto.randomUUID()
    const ms = timeoutMs ?? (kind === "error" ? 6000 : 4000)
    set((s) => ({ toasts: [...s.toasts, { id, kind, message, timeoutMs: ms }] }))
    setTimeout(() => get().dismiss(id), ms)
    return id
  },

  dismiss: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },
}))
