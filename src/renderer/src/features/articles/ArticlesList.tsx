import { Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useArticlesStore } from "./store"
import { ArticleListItem } from "./ArticleListItem"

export function ArticlesList() {
  const articles = useArticlesStore((s) => s.articles)
  const isLoaded = useArticlesStore((s) => s.isLoaded)
  const selectedId = useArticlesStore((s) => s.selectedId)
  const select = useArticlesStore((s) => s.select)
  const create = useArticlesStore((s) => s.create)

  return (
    <aside className="flex w-72 flex-col border-r border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Articles
        </h2>
        <Button size="sm" onClick={() => create()}>
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {!isLoaded ? null : articles.length === 0 ? (
          <div className="flex flex-col items-center gap-2 pt-12 text-neutral-400">
            <FileText className="h-8 w-8" />
            <p className="text-sm">No articles yet</p>
            <Button size="sm" variant="ghost" onClick={() => create()}>
              Create your first article
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {articles.map((article) => (
              <ArticleListItem
                key={article.id}
                article={article}
                isSelected={article.id === selectedId}
                onSelect={() => select(article.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
