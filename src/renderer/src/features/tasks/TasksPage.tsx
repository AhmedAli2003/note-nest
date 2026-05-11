import { CheckSquare } from "lucide-react"

export default function TasksPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
      <CheckSquare className="h-12 w-12" />
      <p className="text-lg font-medium text-neutral-500">No tasks yet</p>
      <p className="text-sm">Coming in phase 3</p>
    </div>
  )
}
