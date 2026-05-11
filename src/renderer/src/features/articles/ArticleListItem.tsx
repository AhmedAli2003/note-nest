import { cn } from "@/lib/cn"
import { formatRelativeTime } from "@/lib/time"
import type { Article } from "@shared/types"

interface ArticleListItemProps {
  article: Article
  isSelected: boolean
  onSelect: () => void
}

function titleOrUntitled(article: Article): string {
  const t = article.title.trim()
  return t || "(Untitled)"
}

function plainPreview(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + "…" : s
}

export function ArticleListItem({ article, isSelected, onSelect }: ArticleListItemProps) {
  const title = titleOrUntitled(article)
  const preview = plainPreview(article.body_html)

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-md px-3 py-2 text-left transition-colors",
        isSelected
          ? "bg-neutral-200 dark:bg-neutral-800"
          : "hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {title === "(Untitled)" ? (
            <span className="italic text-neutral-400">{title}</span>
          ) : (
            truncate(title, 50)
          )}
        </span>
        <span className="shrink-0 text-xs text-neutral-400">
          {formatRelativeTime(article.updated_at)}
        </span>
      </div>
      {preview && (
        <p className="mt-0.5 truncate text-xs text-neutral-500">
          {truncate(preview, 60)}
        </p>
      )}
    </button>
  )
}
