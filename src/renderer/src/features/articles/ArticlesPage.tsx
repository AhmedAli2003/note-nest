import { FileText } from "lucide-react"

export default function ArticlesPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
      <FileText className="h-12 w-12" />
      <p className="text-lg font-medium text-neutral-500">No articles yet</p>
      <p className="text-sm">Coming in phase 4</p>
    </div>
  )
}
